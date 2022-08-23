const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const keys = require("./keys");
const User = require("../models/userModel");

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findById(id).then((user) => {
    cb(null, user);
  });
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      callbackURL: "/auth/twitter/callback",
      proxy: true,
    },
    (token, tokenSecret, profile, cb) => {
      //passport callback function
      console.log(profile);

      //check if user already exists in our db
      User.findOne({ twitterId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have the user
          console.log("User is ", currentUser);
          cb(null, currentUser);
        } else {
          //if not create user in our db
          new User({
            userName: profile.displayName,
            twitterId: profile.id,
            photo: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New user created:" + newUser);
              cb(null, newUser);
            });
        }
      });
    }
  )
);
