import { users } from "../dummyData.js";
import { ApiError } from "../lib/apiError.js";
import { registerValidator, validateHandler } from "../lib/validators.js";
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
        const { username, gender } = input;

        await Promise.all(
          registerValidator().map((validation) =>
            validation.run({ body: input })
          )
        );

        const mockReq = { body: input };
        validateHandler(mockReq, {}, (err) => {
          if (err) throw new ApiError(err.message, 400);
        });

        const existingUser = await User.findOne({ username });
        if (existingUser) throw new ApiError("User already exists", 400);

        // Password hashing is handled in the model using bcrypt

        const profilePic = `https://avatar.iran.liara.run/public/${gender}?${username}`;

        const createUser = await User.create({
          ...input,
          profilePic,
        });

        await context.login(createUser);
        return createUser;
      } catch (err) {
        throw new ApiError(
          err.message || "Internal server error",
          err.status || 500
        );
      }
    },
  },
};

export default userResolver;
