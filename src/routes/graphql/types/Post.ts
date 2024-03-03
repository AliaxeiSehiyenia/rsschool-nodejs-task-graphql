import {GraphQLNonNull, GraphQLObjectType} from 'graphql';
import {GraphQLInputObjectType, GraphQLString} from 'graphql/index.js';
import {UUIDType} from './uuid.js';

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {type: new GraphQLNonNull(UUIDType)},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        authorId: {type: new GraphQLNonNull(UUIDType)},
    }),
});

export const CreatePostInputType = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(UUIDType)},
    },
});

export const ChangePostInputType = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType },
    },
});
