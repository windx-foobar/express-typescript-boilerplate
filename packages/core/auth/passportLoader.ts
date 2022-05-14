import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { User } from '@app/models/User';

export const passportLoader: MicroframeworkLoader = (
  options?: MicroframeworkSettings
) => {
  if (options && options?.getData('connection')) {
    passport.use(
      'basic',
      new BasicStrategy(
        async (email, password, done) => {
          if (!email || !password) return done(undefined, false);

          try {
            const user = await User.findOne({ where: { email } });
            if (!user) return done(undefined, false);

            const authenticated = await user.comparePassword(password);
            if (!authenticated) return done(undefined, false);

            return done(undefined, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }
};
