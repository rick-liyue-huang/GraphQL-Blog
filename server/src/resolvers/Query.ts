import {Context} from "../index";

export const Query = {
	posts: async (parent: any, args: any, {prisma}: Context) => {
		const posts = await prisma.post.findMany({
			where: {
				published: true
			},
			orderBy: [
				{
					createdAt: 'desc'
				},
				{
					title: 'asc'
				}
			]
		});
		return posts;
	},

	me: async (parent: any, args: any, {userInfo, prisma}: Context) => {

		if (!userInfo) {
			return null;
		}

		return prisma.user.findUnique({
			where: {
				id: userInfo.userId
			}
		})
	},

	profile: (parent: any, {userId}: {userId: string}, {prisma, userInfo}: Context) => {

		return prisma.profile.findUnique({
			where: {
				userId: Number(userId)
			}
		})
	}
}
