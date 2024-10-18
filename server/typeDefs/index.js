import { mergeTypeDefs } from "@graphql-tools/merge";

import transactionTypeDef from "./transaction.typeDef.js";
import userTypeDef from "./user.typeDef.js";

const mergedResolvers = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedResolvers;
