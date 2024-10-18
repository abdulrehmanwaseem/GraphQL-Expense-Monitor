import { transactions } from "../dummyData.js";

const transactionResolver = {
  Query: {
    transactions: () => {
      return transactions;
    },
  },
  Mutation: {},
};

export default transactionResolver;
