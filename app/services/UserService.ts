import { Service } from 'typedi';
import { InstanceUpdateOptions } from 'sequelize';
import { User } from '@app/models/User';
import { NotFoundError } from '@packages/core/errors';

@Service()
export class UserService {
  public async update(user: User, data: User, options: InstanceUpdateOptions = {}) {
    try {
      if (!user) throw new NotFoundError('Пользователь не найден');

      await data.classValidate({
        skipMissingProperties: true
      });

      await user.update({ ...data.toJSON() }, options);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
