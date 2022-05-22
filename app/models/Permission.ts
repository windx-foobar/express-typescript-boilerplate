import { Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { Model } from '@packages/advanced-sequelize';
import { Role } from '@app/models/Role';
import { RolePermission } from '@app/models/RolePermission';
import { IsNotEmpty } from 'class-validator';

@Table({ tableName: 'permissions', underscored: true, paranoid: true })
export class Permission extends Model {
  @IsNotEmpty({ message: 'Поле обязательно для заполнения' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
  public description: string;

  @BelongsToMany(() => Role, () => RolePermission)
  public roles: Role[];
}
