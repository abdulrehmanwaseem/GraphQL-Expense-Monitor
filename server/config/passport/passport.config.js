import passport from "passport";
import { User } from "../../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";
import { ApiError } from "../../lib/apiError.js";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log("Serialized user");
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) return done(null, false);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
    console.log("Deserialized user");
  });
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) throw new ApiError("Invalid username or password", 400);

        // TODO: await
        const validPassword = user.comparePassword(password);
        if (!validPassword)
          throw new ApiError("Invalid username or password", 400);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
