import { ApiError } from "../lib/apiError.js";
import { registerValidator, validateHandler } from "../lib/validators.js";
import { User } from "../models/user.model.js";

const userResolver = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        throw new ApiError(
          err.message || "Couldn't get authenticated user",
          400
        );
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        throw new ApiError(err.message || "Couldn't get this user", 400);
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
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
        throw new ApiError(err.message, err.status);
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        const { user } = await context.autheticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (err) {
        throw new ApiError(err.message, err.status);
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw err;
        });

        res.clearCookie("connect.sid");

        return { message: "Logged out successfully" };
      } catch (err) {
        throw new ApiError(err.message, err.status);
      }
    },
  },
};

export default userResolver;
