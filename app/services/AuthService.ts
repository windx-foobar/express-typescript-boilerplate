import { Service } from 'typedi';
import { SaveOptions } from 'sequelize';

import { Mailer, MailerInterface } from '@packages/mailer/decorators';

import { User } from '@app/models/User';
import { UserService } from '@app/services/UserService';

@Service()
export class AuthService {
  constructor(
    private userService: UserService,
    @Mailer() private mailer: MailerInterface
  ) {}

  public async create(user: User, options: SaveOptions = {}): Promise<void> {
    try {
      const newUser = await this.userService.create(user, options);

      await this.mailer.send({
        to: newUser.email,
        mode: 'template',
        subject: 'Завершение регистрации',
        content: 'confirm_registration',
        templateData: {
          name: newUser.email
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
