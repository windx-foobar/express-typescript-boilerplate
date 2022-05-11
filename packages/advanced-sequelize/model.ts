import { Model as BaseModel } from 'sequelize-typescript';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { BadRequestError } from '@packages/core/errors';

interface ClassValidateOptions extends ValidatorOptions {
  toJson: boolean;
}

export abstract class Model<TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes>
  extends BaseModel<TModelAttributes, TCreationAttributes> {

  public async classValidate(
    { toJson = true, ...options }: Partial<ClassValidateOptions> = {}
  ): Promise<ValidationError[] | void> {
    const result = await validate(this, options);

    if (result.length) {
      if (toJson) {
        const transformed = {};

        for (const validationError of result) {
          const currentResult = transformed[validationError.property] = [];

          for (const constraintKey of Object.keys(validationError.constraints)) {
            currentResult.push(validationError.constraints[constraintKey]);
          }
        }

        throw new BadRequestError('Validation error', transformed);
      }

      return result;
    }
  }
}
