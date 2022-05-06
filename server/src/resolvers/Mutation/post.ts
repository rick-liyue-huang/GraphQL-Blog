import {Context} from "../../index";
import {Prisma} from "@prisma/client";
import {Post} from '.prisma/client'

export interface PostArgs {
	post: {
		title?: string;
		content?: string;
	}
}

export interface PostPayloadType {
	userErrors: {message: string}[],
	post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolvers = {
	postCreate: async (prent: any, {post}: PostArgs, {prisma}: Context): Promise<PostPayloadType> => {
		const {title, content} = post;
		if (!title || !content) {
			return {
				userErrors: [{message: 'must provide title or content'}],
				post: null
			}
		}

		// const post = await prisma.post.create({
		// 	data: {
		// 		title, content, authorId: 1
		// 	}
		// });

		return {
			userErrors: [],
			post: await prisma.post.create({
				data: {
					title, content, authorId: 1
				}
			})
		}
	},

	postUpdate: async (_parent: any, {postId, post}: {postId: string, post: PostArgs['post']}, {prisma}: Context): Promise<PostPayloadType> => {
		const {title, content} = post;

		if (!title && !content) {
			return {
				userErrors: [{message: 'Need at least title or content'}],
				post: null
			}
		}

		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});

		if (!existingPost) {
			return {
				userErrors: [{message: 'Post does not exists'}],
				post: null
			}
		}

		let payloadToUpdate = {
			title, content
		}

		if (!title) delete payloadToUpdate.title;
		if (!content) delete payloadToUpdate.content;

		return {
			userErrors: [],
			post: await prisma.post.update({
				data: {
					...payloadToUpdate
				},
				where: {
					id: Number(postId)
				}
			})
		}
	},


	postDelete: async (parent: any, {postId}: {postId: string}, {prisma}: Context): Promise<PostPayloadType> => {
		const post = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});

		if (!post) {
			return {
				userErrors: [{message: 'Post does not exists'}],
				post: null
			}
		}

		return {
			userErrors: [],
			post: await prisma.post.delete({
				where: {
					id: Number(postId)
				}
			})
		}
	},
}
