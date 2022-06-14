import {
  JsonController,
  Get,
  Post,
  Body,
  Put,
  Req
} from 'routing-controllers';

import { Sequelize, SequelizeInterface } from '@packages/advanced-sequelize';
import { Authorized, Can } from '@packages/core/decorators';

import { User } from '@app/models/User';
import { Pet } from '@app/models/Pet';
import { UserService } from '@app/services/UserService';
import { AuthService } from '@app/services/AuthService';

// import { Logger, LoggerInterface } from '@packages/core/decorators/Logger';

@JsonController('/auth')
export class UserController {
  constructor(
    // @Logger(__filename) private logger: LoggerInterface,
    @Sequelize() private sequelize: SequelizeInterface,
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Authorized()
  @Get('/me')
  public index(@Req() req: any) {
    return req.user?.toJSON();
  }

  @Can('pets.self-read')
  @Get('/me/pets')
  public async pets(@Req() req: any) {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();

      const petsRows: Pet[] = await req.user.$get('pets', { transaction });

      await transaction.commit();
      return petsRows.map((row) => row.toJSON());
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Post('/registration')
  public async create(@Body() profile: User) {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();

      await this.authService.create(profile, { transaction });

      await transaction.commit();
      return { message: 'Регистрация успешно завершена' };
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Authorized()
  @Put('/me')
  public async update(@Req() req: any, @Body() data: User) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const user = req.user;
      const updatedUser = await this.userService.update(user, data, { transaction });

      await transaction.commit();
      return updatedUser.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}
