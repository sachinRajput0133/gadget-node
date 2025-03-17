const passport = require("passport");
const util = require("../helpers/utils/messages");
// const { OPEN_API } = require("../../");
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { convertToTz } = require("../services/timezone");
const jwtStrategy = require('../../config/passport');
// const { saveUserViaOauth } = require("../services/OAuthService");
// const { OAUTH } = require("../../config/config");
// const GoogleStrategy = require('passport-google-oauth2').Strategy;

const authentication = (req, res, next) => {
  // const { models } = req.clientDBConnection
  jwtStrategy(passport)
  return passport.authenticate(
    "jwt",
    {
      session: false,
    },
    async (err, user, info) => {
      console.log("🚀 ~ user:", user)
      if (err) {
        return next(err);
      }
      // if (
      //   !req.headers.authorization &&
      //   (req.originalUrl.includes(OPEN_API.getJobRecommendation) ||
      //     req.originalUrl.includes(OPEN_API.getJob))
      // ) {
      //   return next();
      // }
      if (!user) {
        res.message = req.i18n.t("responseMessage.unAuthenticated");
        return util.unAuthenticated(res);
      }

      if (user && !user.isActive) {
        res.message = req.i18n.t("auth.accountDeactivated");
        return util.unAuthenticated(res);
      }

      req.userId = user.id;
      req.user = user;

      const userData = req.user;
      if (req.method !== "GET") {
        if (req.method === "POST" && req.originalUrl.search("create") !== -1) {
          req.body.createdBy = userData?._id;
        } else if (req.method === "DELETE") {
          req.body.deletedBy = userData?._id;
          req.body.deletedAt = await convertToTz({ tz: req?.headers?.timezone ?? TZ, date: new Date() });
          req.body.isActive = false
        } else if (req.method === "PUT" || req.method === "PATCH") {
          const softDelete = req.originalUrl.search("soft-delete");
          if (softDelete !== -1) {
            req.body.deletedBy = userData?._id;
            req.body.deletedAt = await convertToTz({ tz: req?.headers?.timezone ?? TZ, date: new Date() });
            req.body.isActive = false
          }
          req.body.updatedBy = userData?._id;
        }
      }
      next();
    }
  )(req, res, next);
};

// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: OAUTH.LINKEDIN.LINKEDIN_CLIENT_ID,
//       clientSecret: OAUTH.LINKEDIN.LINauthentication {
//           return done(null, profile);
//         });
//       } catch (error) {
//         logger.error("Error - LinkedInStrategy", error);
//         throw new Error(Error)
//       }
//     }
//   )
// )


// passport.use(new GoogleStrategy({
//   clientID: OAUTH.GOOGLE.GOOGLE_OAUTH_CLIENT_ID,
//   clientSecret: OAUTH.GOOGLE.GOOGLE_OAUTH_CLIENT_SECRET,
//   callbackURL: OAUTH.GOOGLE.GOOGLE_OAUTH_CALLBACK_URL,
//   passReqToCallback: true
// },
//   async (request, accessToken, refreshToken, profile, done) => {
//     try {
//       const data = {
//         name: profile.displayName,
//         firstName: profile.given_name,
//         lastName: profile.family_name,
//         email: profile.email,
//         profilePicture: profile.picture,
//         oauth: {
//           "google": {
//             allow: true,
//             accessToken: accessToken,
//             socialId: profile.id,
//             enable: true
//           }
//         }
//       }

//       const savedUser = await saveUserViaOauth({
//         accessToken,
//         userProfile: data,
//         oauthProvider: 'google'
//       }, request);

//       return done(null, {
//         accessToken,
//         profile,
//         jwtToken: savedUser._doc.token
//       })
//     } catch (error) {
//       logger.error("Error - googleStrategy", error);
//       return done(error, false)
//     }
//   }
// ));

passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.initialize();

module.exports = {
  authentication,
};
