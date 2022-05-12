import { Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Model } from '@packages/advanced-sequelize';
import { User } from '@app/models/User';
import { IsNotEmpty } from 'class-validator';

@Table({ tableName: 'pets', underscored: true, paranoid: true })
export class Pet extends Model {
  @IsNotEmpty({ message: 'Поле обязательно для заполнения' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  public name: string;

  @IsNotEmpty({ message: 'Поле обязательно для заполнения' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  public age: number;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  public payload: object;

  @ForeignKey(() => User)
  public userId: number | null;

  @BelongsTo(() => User)
  public user: User | null;
}
