import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ValidationException from '../../exception/validation/validation';


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);
    console.log('value', value);
    console.log('obj', obj);
    console.log('errors', errors);
    if (errors.length) {
      const messages = errors.map((error) => {

        return {
          name: error.property,
          message: Object.values(error.constraints),
        }
      })
      console.log('errors', JSON.stringify(errors));
      throw new ValidationException(messages)
    }
    return value;
  }

}
