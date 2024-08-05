import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';
import { Gender } from '@nx-nutrition-models';

export class CreateUserDto {
  @IsEmail({}, {message: 'BAD_EMAIL'})
  @IsNotEmpty({message: 'EMAIL_MUST_NOT_BE_EMPTY'})
  readonly email: string;
  @IsPhoneNumber('RU', {message: 'NOT_RUSSIAN_PHONE_NUMBER'})
  @IsNotEmpty({message: 'PHONE_MUST_NOT_BE_EMPTY'})
  readonly phone: string;
  @IsNotEmpty({message: 'NAME_MUST_NOT_BE_EMPTY'})
  readonly name: string;
  @IsNotEmpty({message: 'FULL_NAME_NAME_MUST_NOT_BE_EMPTY'})
  readonly fullName: string;
  @IsNotEmpty({message: 'GENDER_MUST_NOT_BE_EMPTY'})
  readonly gender: Gender;
  @IsNotEmpty({message: 'DATE_ISSUE_MUST_NOT_BE_EMPTY'})
  readonly dateIssue: string;
  @IsNotEmpty({message: 'PASSWORD_MUST_NOT_BE_EMPTY'})
  @Length(8,16, {message: 'MIN_8_MAX_16'})
  password: string;
}
