import {Context} from "../../index";
import validator from "validator";
// import {Prisma} from "@prisma/client";
// import {User} from '.prisma/client'
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import {JWT_SECRET} from '../../keys'

export interface UserPayload {
	userErrors: {message: string}[];
	// user: User | Prisma.Prisma__UserClient<User> | null;
	token: string | null;
}

export interface SignupArgs {
	credentials: {
		email: string;
		password: string;
	}
	name: string;
	bio: string;
}

export interface LoginArgs {
	credentials: {
		email: string;
		password: string;
	}
}


export const authResolvers = {
	signup: async (parent: any, {credentials, name, bio}: SignupArgs, {prisma}: Context): Promise<UserPayload> => {

		const {email, password} = credentials;
		const isEmail = validator.isEmail(email);
		if (!isEmail) {
			return {
				userErrors: [{message: 'email format is not correct'}],
				token: null
			}
		}

		const isPassword = validator.isLength(password, {min: 6});
		if (!isPassword) {
			return {
				userErrors: [{message: 'password format is not correct'}],
				token: null
			}
		}

		if (!name || !bio) {
			return {
				userErrors: [{message: 'invalid name or bio'}],
				token: null
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// create new user
		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword
			}
		});

		// create new profile
		await prisma.profile.create({
			data: {
				bio: bio,
				userId: user.id
			}
		})

		const token = JWT.sign(
			{
				userId: user.id,
				email: user.email
			},
			JWT_SECRET,
			{
				expiresIn: '1d'
			}
		);

		return {
			userErrors: [],
			token: token
		}

		// return await prisma.user.create({ data: {
		// 		email, password, name
		// 	}
		// })
	},


	login: async (parent: any, {credentials}: LoginArgs, {prisma}: Context): Promise<UserPayload> => {

		const {email, password} = credentials;
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			return {
				userErrors: [{message: 'invalid credential'}],
				token: null
			}
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return {
				userErrors: [{message: 'password not match'}],
				token: null
			}
		}

		return {
			userErrors: [],
			token: JWT.sign(
				{
					userId: user.id,
					email: user.email
				},
				JWT_SECRET,
				{
					expiresIn: '1d'
				}
			)
		}

	}
}
