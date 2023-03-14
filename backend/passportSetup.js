const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:"500610709749-4f8bvpuvfes6ig395sh35r3398e6t7oc.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));