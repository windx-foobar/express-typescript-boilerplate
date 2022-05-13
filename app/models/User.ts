import {
  Table,
  Column,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  DefaultScope,
  HasMany
} from 'sequelize-typescript';
import { Model } from '@packages/advanced-sequelize';
import { Pet } from '@app/models/Pet';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';

@DefaultScope(() => (
  {
    attributes: {
      exclude: ['password']
    }
  }
))
@Table({ tableName: 'users', underscored: true, paranoid: true })
export class User extends Model {
  @BeforeCreate
  public static async hashBeforeCreate(model: User) {
    if (model.password === 'hashedPassword' && model.hashedPassword) {
      model.password = model.hashedPassword;
    } else {
      await model.hashPassword();
    }
  }

  @BeforeUpdate
  public static async hashBeforeUpdate(model: User) {
    if (!model.changed('password')) return;
    await this.hashBeforeCreate(model);
  }

  @IsNotEmpty({ message: 'Поле обязательно для заполнения' })
  @IsEmail(undefined, { message: 'Поле должно быть корректным email' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: { name: 'uniqueEmail', msg: 'E-mail уже используется' }
  })
  public email: string;

  @IsNotEmpty({ message: 'Поле обязательно для заполнения' })
  @MinLength(5, { message: 'Поле должно быть не менее $constraint1 символов' })
  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({
    type: DataType.VIRTUAL,
    set(val: string) {
      this.setDataValue('hashedPassword', val);
    }
  })
  public hashedPassword: string;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  public payload: object;

  @HasMany(() => Pet)
  public pets: Pet[];

  public async hashPassword(): Promise<void> {
    if (!this.changed('password')) return;
    try {
      const { password } = this;
      const salt = await bcrypt.genSalt();

      this.password = await bcrypt.hash(password, salt);
    } catch (error) {
      throw error;
    }
  }

  public async comparePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  }
}
