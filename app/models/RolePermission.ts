import { Table, Column, ForeignKey, CreatedAt } from 'sequelize-typescript';
import { Model } from '@packages/advanced-sequelize';
import { Permission } from '@app/models/Permission';
import { Role } from '@app/models/Role';

@Table({
  tableName: 'roles_permissions',
  underscored: true,
  paranoid: false,
  timestamps: false,
  createdAt: 'createdAt'
})
export class RolePermission extends Model {
  @CreatedAt
  public createdAt: Date;

  @ForeignKey(() => Permission)
  @Column
  public permissionId: number;

  @ForeignKey(() => Role)
  @Column
  public roleId: number;
}
