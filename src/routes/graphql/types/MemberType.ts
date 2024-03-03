import {GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType} from 'graphql';
import {MemberTypeEnumType} from "./MemberTypeEnumId.js";

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {type: new GraphQLNonNull(MemberTypeEnumType)},
        discount: {type: GraphQLFloat},
        postsLimitPerMonth: {type: GraphQLInt},
    }),
});
