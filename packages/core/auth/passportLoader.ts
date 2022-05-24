import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Passport } from 'passport';
import { BasicStrategy } from 'passport-http';
import { Sequelize } from 'sequelize-typescript';

/**
 * passportLoader
 * ------------------------------
 * Загрузчик passport и стратегии-примера
 */
export const passportLoader: MicroframeworkLoader = (
  options?: MicroframeworkSettings
) => {
  const sequelize: Sequelize = options.getData('connection');
  const passport = new Passport();

  if (sequelize) {
    passport.use(
      'basic',
      new BasicStrategy(
        async (email, password, done) => {
          if (!email || !password) return done(undefined, false);

          try {
            // В loader нельзя использовать модели напрямую
            // Нужно вытаскивать их из sequelize
            const User: any = sequelize.models.User;

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

  options.setData('passport', passport);
};
