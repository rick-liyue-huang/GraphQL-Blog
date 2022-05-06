
import {ApolloServer} from 'apollo-server';
import {typeDefs} from "./schema";
import {Query, Mutation} from "./resolvers";
import {PrismaClient, Prisma} from '@prisma/client';


const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
}

const resolvers = {
	Query, Mutation
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: {prisma}
});

server.listen().then(({url}) => {
	console.log(`this server is listening on port of ${url}`);
})
