import {
  JsonController,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BodyParam
} from 'routing-controllers';
import { Sequelize, SequelizeInterface } from '@packages/advanced-sequelize';
import { NotFoundError, BadRequestError } from '@packages/core/errors';
import { Can } from '@packages/core/decorators';
import { User } from '@app/models/User';
import { Pet } from '@app/models/Pet';
import { Maybe } from '@packages/core/utils';

// import { Logger, LoggerInterface } from '@packages/core/decorators/Logger';

@JsonController('/pets')
export class PetController {
  constructor(
    // @Logger(__filename) private logger: LoggerInterface,
    @Sequelize() private sequelize: SequelizeInterface
  ) {}

  @Get()
  public async index() {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const petRows = await Pet.findAll({
        transaction
      });

      await transaction.commit();
      return petRows.map((row) => row.toJSON());
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Get('/:id')
  public async show(@Param('id') id: string) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const petRow = await Pet.findByPk(id, {
        include: [{ association: 'user' }],
        transaction
      });
      if (!petRow) throw new NotFoundError('Питомец не найден');

      await transaction.commit();
      return petRow.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('pets.write')
  @Post()
  public async create(@Body() newPet: Pet) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      await newPet.classValidate();

      const petRow = await newPet.save({ transaction });

      await transaction.commit();
      return petRow.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('pets.write')
  @Put('/:id')
  public async update(@Param('id') id: string, @Body() updatedPet: Pet) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const petRow = await Pet.findByPk(id, { transaction });
      if (!petRow) throw new NotFoundError('Питомец не найден');

      await updatedPet.classValidate({
        skipMissingProperties: true
      });
      await petRow.update({ ...updatedPet.toJSON() }, { transaction });

      await transaction.commit();
      return petRow.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can('pets.write')
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      const petRow = await Pet.findByPk(id, { transaction });
      if (!petRow) throw new NotFoundError('Питомец не найден');

      await petRow.destroy({ transaction });

      await transaction.commit();
      return { id: petRow.id };
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  @Can(['pets.write', 'users.write'])
  @Put('/:id/user')
  public async castUser(
    @Param('id') id: string,
    @BodyParam('userId') userId: Maybe<string | number>
  ) {
    let transaction;

    try {
      transaction = await this.sequelize.transaction();

      if (!userId) throw new BadRequestError('Id нового хозяина не передан в теле');

      const petRow = await Pet.findByPk(id, {
        transaction
      });
      if (!petRow) throw new NotFoundError('Питомец не найден');

      const userRow = await User.findByPk(userId, {
        transaction
      });
      if (!userRow) throw new NotFoundError('Хозяин не найден');

      await petRow.$set('user', userRow);

      await transaction.commit();
      return petRow.toJSON();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}
