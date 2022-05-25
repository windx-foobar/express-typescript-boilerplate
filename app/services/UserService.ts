import { Service } from 'typedi';
import { InstanceUpdateOptions, SaveOptions } from 'sequelize';

import { NotFoundError } from '@packages/core/errors';
import { EventDispatcher, EventDispatcherInterface } from '@packages/core/decorators';

import { User } from '@app/models/User';
import { events } from '@app/http/subscribers/events';

@Service()
export class UserService {
  constructor(
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {}

  public async create(user: User, options: SaveOptions = {}): Promise<User> {
    try {
      await user.classValidate();

      const newUser = await user.save(options);
      this.eventDispatcher.dispatch(events.user.created, newUser);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

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
