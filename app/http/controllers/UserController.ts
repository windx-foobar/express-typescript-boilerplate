import { JsonController, Get, Post, Body, Param, Delete, Put } from 'routing-controllers';
import { User } from '@app/models/User';
import { Pet } from '@app/models/Pet';
// import { Logger, LoggerInterface } from '@packages/core/decorators/Logger';
import { Sequelize, SequelizeInterface } from '@packages/advanced-sequelize';
import { BaseJsonController } from '@packages/core/controllers';
import { NotFoundError } from '@packages/core/errors';

@JsonController('/users')
export class UserController extends BaseJsonController {
  constructor(
    // @Logger(__filename) private logger: LoggerInterface,
    @Sequelize() private sequelize: SequelizeInterface
  ) {
    super();
  }

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
      return this.handleError(error);
    }
  }

  @Get('/:id')
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
      return this.handleError(error);
    }
  }

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
      return this.handleError(error);
    }
  }

  @Put('/:id')
  public async update(@Param('id') id: string, @Body() updatedUser: User) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const userRow = await User.findByPk(id, { transaction });
      if (!userRow) throw new NotFoundError('Пользователь не найден');

      await updatedUser.classValidate({
        skipMissingProperties: true
      });
      await userRow.update({ ...updatedUser.toJSON() }, { transaction });

      await transaction.commit();
      return userRow.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      return this.handleError(error);
    }
  }

  @Delete('/:id')
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
      return this.handleError(error);
    }
  }

  @Get('/:id/pets')
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
      return this.handleError(error);
    }
  }

  @Post('/:id/pets')
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
      return this.handleError(error);
    }
  }
}
