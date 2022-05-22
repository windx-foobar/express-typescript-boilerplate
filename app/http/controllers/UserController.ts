import {
  JsonController,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req
} from 'routing-controllers';
import { Sequelize, SequelizeInterface } from '@packages/advanced-sequelize';
import { NotFoundError } from '@packages/core/errors';
import { Can } from '@packages/core/decorators';
import { User } from '@app/models/User';
import { Pet } from '@app/models/Pet';
import { UserService } from '@app/services/UserService';

// import { Logger, LoggerInterface } from '@packages/core/decorators/Logger';

@JsonController('/users')
export class UserController {
  constructor(
    // @Logger(__filename) private logger: LoggerInterface,
    @Sequelize() private sequelize: SequelizeInterface,
    private userService: UserService
  ) {}

  @Can('users.read', 'super_admin')
  @Get()
  public async index() {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const userRows = await User.findAll({
        transaction
      });

      await transaction.commit();
      return userRows.map((row: User) => row.toJSON());
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('pets.self-read')
  @Get('/me/pets')
  public async mePets(@Req() req: any) {
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

  @Can('users.read', ['user', 'super_admin'])
  @Get('/me')
  public me(@Req() req: any) {
    return req.user?.toJSON();
  }

  @Can('users.read', ['user', 'super_admin'])
  @Put('/me')
  public async meUpdate(@Req() req: any, @Body() data: User) {
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

  @Can('users.read', 'super_admin')
  @Get('/:id([0-9]+)')
  public async show(@Param('id') id: string) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const userRow = await User.findByPk(id, { transaction });
      if (!userRow) throw new NotFoundError('Пользователь не найден');

      await transaction.commit();
      return userRow.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('users.write')
  @Post()
  public async create(@Body() newUser: User) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      await newUser.classValidate();

      const userRow = await newUser.save({ transaction });

      await transaction.commit();
      return userRow.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('users.write')
  @Put('/:id([0-9]+)')
  public async update(@Param('id') id: string, @Body() data: User) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const user = await User.findByPk(id, { transaction });
      const updatedUser = await this.userService.update(user, data, { transaction });

      await transaction.commit();
      return updatedUser.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('users.write')
  @Delete('/:id([0-9]+)')
  public async delete(@Param('id') id: string) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const userRow = await User.findByPk(id, { transaction });
      if (!userRow) throw new NotFoundError('Пользователь не найден');

      await userRow.destroy({ transaction });

      await transaction.commit();
      return { id: userRow.id };
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('users.read', 'super_admin')
  @Get('/:id([0-9]+)/pets')
  public async showPets(@Param('id') id: string) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const userRow = await User.findByPk(id, {
        include: [{ association: 'pets' }],
        transaction
      });
      if (!userRow) throw new NotFoundError('Пользователь не найден');

      await transaction.commit();
      return userRow.pets.map((row) => row.toJSON());
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can(['users.write', 'pets.write'])
  @Post('/:id([0-9]+)/pets')
  public async createPet(@Param('id') id: string, @Body() newPet: Pet) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const userRow = await User.findByPk(id, { transaction });
      if (!userRow) throw new NotFoundError('Пользователь не найден');

      await newPet.classValidate();

      const pet = await userRow.$create<Pet>(
        'pet',
        newPet.toJSON(),
        { transaction }
      );

      await transaction.commit();
      return pet.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}
