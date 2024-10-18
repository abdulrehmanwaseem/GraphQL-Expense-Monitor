import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "../resolvers/user.resolver.js";
import transactionResolver from "../resolvers/transaction.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

export default mergedResolvers;
