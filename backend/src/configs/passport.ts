import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import logger from '../libs/logger';
import { User } from '../models/User';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
          // User exists, update Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName || profile.name?.givenName || 'User',
            email: profile.emails?.[0]?.value || '',
            password: '', // No password for OAuth users
            googleId: profile.id,
            isEmailVerified: true, // Google emails are verified
            avatar: profile.photos?.[0]?.value
              ? {
                  url: profile.photos[0].value,
                  publicId: '',
                }
              : undefined,
          });
        }

        return done(null, user);
      } catch (error) {
        logger.error(
          `Google OAuth error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        return done(error, undefined);
      }
    }
  )
);

// Serialize user for session (if using sessions)
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
