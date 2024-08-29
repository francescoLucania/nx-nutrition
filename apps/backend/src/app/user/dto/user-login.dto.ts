import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString({ message: 'Login должен быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly login: string;
  @IsString({ message: 'Login должен быть строкой' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly password: string;
}
