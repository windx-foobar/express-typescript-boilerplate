import {
  Table,
  Column,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  DefaultScope,
  HasMany,
  BelongsToMany
} from 'sequelize-typescript';
import { FindOptions, Op } from 'sequelize';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { isEqual } from 'lodash';
import { Model } from '@packages/advanced-sequelize';
import { Pet } from '@app/models/Pet';
import { Role } from '@app/models/Role';
import { UserRole } from '@app/models/UserRole';

interface CanFindOptions extends Pick<FindOptions, 'transaction'> {
  rolesNames?: string[];
}

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

  @BelongsToMany(() => Role, () => UserRole)
  public roles: Role[];

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

  public async comparePassword(
    password: string,
    options: Pick<FindOptions, 'transaction'> = {}
  ): Promise<boolean> {
    let userPassword: string;

    try {
      if (!this.password) {
        const user = await User.unscoped().findByPk(this.id, options);
        userPassword = user.password;
      } else {
        userPassword = this.password;
      }

      return await bcrypt.compare(password, userPassword);
    } catch (error) {
      throw error;
    }
  }

  public async can(
    permissions: string[],
    options: CanFindOptions = {}
  ) {
    try {
      const { transaction = undefined, rolesNames = [] } = options;
      const where = {} as any;

      if (rolesNames?.length) {
        where.name = { [Op.in]: rolesNames };
      }

      const roles = await this.$get('roles', {
        transaction,
        include: [{ association: 'permissions' }],
        where
      });

      if (!permissions?.length) return !!roles?.length;

      const userPermissions = [];

      roles.forEach((role) => {
        const localPermissions = Array.isArray(role?.permissions)
          ? role.permissions
          : [];

        userPermissions.push(...localPermissions.map((permission) => permission.name));
      });

      const filteredPermissions = permissions.filter((permission) => {
        return !!userPermissions
          .filter((userPermission) => {
            if (permission === userPermission) return true;

            if (userPermission.endsWith('self-write') || userPermission.endsWith('write')) {
              if (permission === userPermission.replace(/(self-)?write/, 'self-read')) {
                return true;
              }

              if (permission === userPermission.replace(/(self-)?write/, 'read')) {
                return true;
              }
            }

            if (userPermission.endsWith('self-write')) {
              if (permission === userPermission.replace(/self-write/, 'write')) {
                return true;
              }
            }

            if (userPermission.endsWith('self-read')) {
              if (permission === userPermission.replace(/self-read/, 'read')) {
                return true;
              }
            }

            return false;
          })
          .length;
      });

      return isEqual(filteredPermissions, permissions);
    } catch (error) {
      throw error;
    }
  }
}
