import { Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { Model } from '@packages/advanced-sequelize';
import { User } from '@app/models/User';
import { UserRole } from '@app/models/UserRole';
import { Permission } from '@app/models/Permission';
import { RolePermission } from '@app/models/RolePermission';
import { IsNotEmpty } from 'class-validator';

@Table({ tableName: 'roles', underscored: true, paranoid: true })
export class Role extends Model {
  @IsNotEmpty({ message: 'Поле обязательно для заполнения' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
  public description: string;

  @BelongsToMany(() => User, () => UserRole)
  public users: User[];

  @BelongsToMany(() => Permission, () => RolePermission)
  public permissions: Permission[];
}
