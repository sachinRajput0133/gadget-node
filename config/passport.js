const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../src/models/User'); // Ensure the path is correct
const { JWT } = require('./constants/authConstant');

const jwtStrategy = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = JWT.JWT_SECRET;

  console.log("🚀 ~ jwtStrategy ~ opts:", opts);

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log("🚀 ~ newJwtStrategy ~ jwt_payload:", jwt_payload)
      try {
        const user = await User.findOne({ _id: jwt_payload.id }); // ✅ Use async/await
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

module.exports = jwtStrategy;
