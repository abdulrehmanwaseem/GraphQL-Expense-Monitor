import { ApiError } from "../lib/apiError.js";
import { Transaction } from "../models/transaction.model.js";
import catchAsync from "express-async-handler";

const transactionResolver = {
  Query: {
    transactions: catchAsync(async (_, __, context) => {
      if (!context.getUser()) throw new ApiError("Unauthorized", 401);
      const userId = await context.getUser()._id;

      const transactions = await Transaction.find({ userId });
      return transactions;
    }),
    transaction: catchAsync(async (_, { transactionId }) => {
      const transactions = await Transaction.findById(transactionId);
      return transactions;
    }),
  },
  Mutation: {
    createTransaction: catchAsync(async (_, input, context) => {
      const newTransaction = await Transaction.create({
        ...input,
        userId: context.getUser()._id,
      });
      return newTransaction;
    }),
    updateTransaction: catchAsync(async (_, input) => {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        input.transactionId,
        input,
        { new: true }
      );

      return updatedTransaction;
    }),
    deleteTransaction: catchAsync(async (_, { transactionId }) => {
      const deletedTransaction = await Transaction.findByIdAndDelete(
        transactionId
      );
      return deletedTransaction;
    }),
  },
};

export default transactionResolver;
