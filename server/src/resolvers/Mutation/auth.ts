import {Context} from "../../index";
import validator from "validator";
import {Prisma} from "@prisma/client";
import {User} from '.prisma/client'

export interface UserPayload {
	userErrors: {message: string}[];
	user: User | Prisma.Prisma__UserClient<User> | null;
}

export interface SignupArgs {
	email: string;
	name: string;
	bio: string;
	password: string;
}


export const authResolvers = {
	signup: async (parent: any, {email, password, name, bio}: SignupArgs, {prisma}: Context): Promise<UserPayload> => {

		const isEmail = validator.isEmail(email);
		if (!isEmail) {
			return {
				userErrors: [{message: 'email format is not correct'}],
				user: null
			}
		}

		const isPassword = validator.isLength(password, {min: 6});
		if (!isPassword) {
			return {
				userErrors: [{message: 'password format is not correct'}],
				user: null
			}
		}

		if (!name || !bio) {
			return {
				userErrors: [{message: 'invalid name or bio'}],
				user: null
			}
		}



		return {
			userErrors: [],
			user: null
		}

		// return await prisma.user.create({ data: {
		// 		email, password, name
		// 	}
		// })
	}
}
