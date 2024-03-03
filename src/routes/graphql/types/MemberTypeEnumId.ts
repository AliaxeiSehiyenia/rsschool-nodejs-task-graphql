import { GraphQLEnumType } from 'graphql/type/index.js';
import {MemberTypeId} from "../../member-types/schemas.js";

export const MemberTypeEnumType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS },
  },
});
