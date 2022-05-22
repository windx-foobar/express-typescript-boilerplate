import { Table, Column, ForeignKey, CreatedAt } from 'sequelize-typescript';
import { Model } from '@packages/advanced-sequelize';
import { User } from '@app/models/User';
import { Role } from '@app/models/Role';

@Table({
  tableName: 'users_roles',
  underscored: true,
  paranoid: false,
  timestamps: false,
  createdAt: 'createdAt'
})
export class UserRole extends Model {
  @CreatedAt
  public createdAt: Date;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @ForeignKey(() => Role)
  @Column
  public roleId: number;
}
