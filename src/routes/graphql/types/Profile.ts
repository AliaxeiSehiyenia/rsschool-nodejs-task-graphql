import {GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType} from "graphql";
import {UUIDType} from "./uuid.js";
import {MemberType} from "./MemberType.js";
import {PrismaClient, Profile} from '@prisma/client';
import {GraphQLNonNull} from "graphql/index.js";
import {MemberTypeEnumType} from "./MemberTypeEnumId.js";

const prisma = new PrismaClient();

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: new GraphQLNonNull(UUIDType)},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        userId: {type: new GraphQLNonNull(UUIDType)},
        memberTypeId: {type: new GraphQLNonNull(MemberTypeEnumType)},
        memberType: {
            type: MemberType,
            resolve: (profile: Profile) => {
                return prisma.memberType.findUnique({
                    where: {id: profile.memberTypeId},
                });
            },
        },
    }),
});

export const CreateProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeEnumType) },
    },
});