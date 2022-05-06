import {Context} from "../index";

interface UserParentType {
	id: number;
}
export const User = {
	posts: async (parent: UserParentType, args: any, {userInfo, prisma}: Context) => {

		const isOwnPosts = parent.id === userInfo?.userId

		if (isOwnPosts) {
			return prisma.post.findMany({
				where: {
					authorId: parent.id
				},
				orderBy: [{
					createdAt: 'desc'
				}]
			})
		} else {
			return prisma.post.findMany({
				where: {
					authorId: parent.id,
					published: true
				},
				orderBy: [{
					createdAt: 'desc'
				}]
			})
		}
	},

}
