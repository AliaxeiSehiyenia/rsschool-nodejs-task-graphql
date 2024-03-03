import {GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType} from 'graphql';
import {GraphQLString} from 'graphql/index.js';
import {UUIDType} from './uuid.js';
import * as runtime from '@prisma/client';
import {PrismaClient, User} from '@prisma/client';
import {PostType} from "./Post.js";
import {ProfileType} from "./Profile.js";

const prisma = new PrismaClient();

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: new GraphQLNonNull(UUIDType)},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
        profile: {
            type: ProfileType,
            resolve: (user: User) => {
                return prisma.profile.findUnique({
                    where: {userId: user.id},
                });
            },
        },
        posts: {
            type: new GraphQLNonNull(new GraphQLList(PostType)),
            resolve: (user: User) => {
                return prisma.post.findMany({
                    where: {authorId: user.id},
                });
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: (user: runtime.User) => {
                return prisma.user.findMany({
                    where: {subscribedToUser: {some: {subscriberId: user.id}}},
                });
            },
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: (user: runtime.User) => {
                return prisma.user.findMany({
                    where: {userSubscribedTo: {some: {authorId: user.id}}},
                });
            },
        },
    }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        balance: {type: new GraphQLNonNull(GraphQLFloat)},
    },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: {
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    },
});
