import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, parse, Source, validate} from 'graphql';
import {UserType} from "./types/User.js";
import depthLimit from "graphql-depth-limit";
import {MemberType} from "./types/MemberType.js";
import {MemberTypeEnumType} from "./types/MemberTypeEnumId.js";
import {PostType} from "./types/Post.js";
import {ProfileType} from "./types/Profile.js";
import {UUIDType} from "./types/uuid.js";
import {UUID} from "crypto";

export enum MemberTypeId {
    BASIC = 'basic',
    BUSINESS = 'business',
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const {prisma} = fastify;
    fastify.route({
        url: '/',
        method: 'POST',
        schema: {
            ...createGqlResponseSchema,
            response: {
                200: gqlResponseSchema,
            },
        },
        async handler(req) {
            const source = new Source(req.body.query);
            const schema = new GraphQLSchema({
                query: new GraphQLObjectType({
                    name: 'Query',
                    fields: () => ({
                        users: {
                            type: new GraphQLList(UserType),
                            resolve: () => {
                                return prisma.user.findMany();
                            },
                        },
                        user: {
                            type: UserType as GraphQLObjectType,
                            args: {id: {type: new GraphQLNonNull(UUIDType)}},
                            resolve: (_source, {id}: { id: UUID }) => {
                                return prisma.user.findUnique({
                                    where: {id},
                                });
                            },
                        },
                        posts: {
                            type: new GraphQLList(PostType),
                            resolve: () => {
                                return prisma.post.findMany();
                            },
                        },
                        post: {
                            type: PostType,
                            args: {id: {type: new GraphQLNonNull(UUIDType)}},
                            resolve: (_source, {id}: { id: UUID }) => {
                                return prisma.post.findUnique({where: {id}});
                            },
                        },
                        postsByUserId: {
                            type: new GraphQLList(PostType),
                            args: {id: {type: new GraphQLNonNull(UUIDType)}},
                            resolve: async (_source, {id}: { id: UUID }) => {
                                return prisma.post.findMany({where: {id}});
                            }
                        },
                        profiles: {
                            type: new GraphQLList(ProfileType),
                            resolve: () => {
                                return prisma.profile.findMany();
                            },
                        },
                        profile: {
                            type: ProfileType,
                            args: {id: {type: new GraphQLNonNull(UUIDType)}},
                            resolve: (_source, {id}: { id: UUID }) => {
                                return prisma.profile.findUnique({where: {id}});
                            },
                        },
                        profileByUserId: {
                            type: ProfileType,
                            args: {id: {type: new GraphQLNonNull(UUIDType)}},
                            resolve: async (_source, {id}: { id: UUID }) => {
                                return prisma.profile.findUnique({where: {id}});
                            }
                        },
                        memberTypes: {
                            type: new GraphQLList(MemberType),
                            resolve: () => {
                                return prisma.memberType.findMany();
                            },
                        },
                        memberType: {
                            type: MemberType,
                            args: {id: {type: new GraphQLNonNull(MemberTypeEnumType)}},
                            resolve: (_source, {id}: { id: MemberTypeId }) => {
                                return prisma.memberType.findUnique({where: {id}});
                            },
                        },
                    }),
                }),
            });

            const errors = validate(schema, parse(source), [depthLimit(5)]);
            if (errors.length) {
                return {
                    errors,
                };
            }

            return graphql({
                schema: schema,
                source: source,
                variableValues: req.body.variables,
                contextValue: {prisma},
            });
        },
    });
};

export default plugin;
