import {Context} from "../index";
import {userLoader} from "../loaders/userLoader";

interface PostParentType {
	authorId: number;
}
export const Post = {
	user: async (parent: PostParentType, args: any, {prisma}: Context) => {

		/*return prisma.user.findUnique({
			where: {
				id: parent.authorId
			}
		})*/
		return userLoader.load(parent.authorId)

	},

}
