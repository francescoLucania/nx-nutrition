import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, {message: 'Не корректный email'})
  @IsString({message: 'Email должен быть строкой'})
  @IsNotEmpty({message: 'Не должно быть пустым'})
  readonly email: string;
  @IsPhoneNumber('RU')
  @IsNotEmpty({message: 'Не должно быть пустым'})
  readonly phone: string;
  @IsNotEmpty({message: 'Не должно быть пустым'})
  readonly name: string;
  @IsNotEmpty({message: 'Не должно быть пустым'})
  readonly fullName: string;
  @IsNotEmpty({message: 'Не должно быть пустым'})
  readonly dateIssue: string;
  @IsNotEmpty({message: 'Не должно быть пустым'})
  @Length(8,16, {message: 'Пароль должен содержать не менее 8 и не более 16 символов'})
  password: string;
}
