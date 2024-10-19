import { users } from "../dummyData.js";
import { User } from "../models/user.model.js";

const userResolver = {
  Query: {
    users: () => {
      return users;
    },
    user: (_, { userId }) => {
      return users.find((user) => user._id === userId);
    },
  },
  Mutation: {
    signup: async (_, { input }, context) => {
      try {
        //TODO: Validation to ensure all required fields are present

        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error("User already exists");

        // Password hashing is handled in the model using bcrypt
      } catch (error) {}
    },
  },
};

export default userResolver;
