import {
  Response,
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException, HttpStatus, Query, UsePipes, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ObjectId } from 'mongoose';
import { ValidationPipe } from '../pipes/validation/validation';
import { User } from './schemas/user.schema';
import { UserDto } from './dto/user-public.dto';


@Controller('/user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @UsePipes(ValidationPipe)
  @Post('/create')
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'avatar', maxCount: 1 },
  // ]))
  public async create(
    // @UploadedFiles() avatar,
    @Body() dto: CreateUserDto,
    @Response() response,
  ) {
    console.log('controller dto', dto);
    // const picture = avatar?.avatar[0];
    const user = await this.userService.create({
      ...dto,
    });
    // response.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 100, httpOnly: true})
    return this.setRefreshTokenToken(response, user).send(user);
  }

  @UsePipes(ValidationPipe)
  @Post('/uploadAvatar')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
  ]))
  public async uploadAvatar(
    @UploadedFiles() avatar,
    @Response() res,
  ) {

    const userData = { avatar: '...' }
    return res.send(userData);
  }

  @Get('/activate')
  public async activate(
    @Query() query: {id: string},
    @Response() res,
  ) {
    try {
      const user = await this.userService.activate(query.id);
      return res.send({
        activation: user.isActivated,
        userInfo: {
          name: user.name,
          fullName: user.fullName,
          email: user.email,
        }
      });
    } catch (e) {
      throw new HttpException({
        status: e.status,
        error: e.message,
      }, HttpStatus.FORBIDDEN, {
        cause: e
      });
    }
  }

  @Get('/deleteAllUsers')
  public deleteAllUsers() {
    return this.userService.deleteAllUsers();
  }

  @UsePipes(ValidationPipe)
  @Post('/login')
  public async login(
    @Body() body: UserLoginDto,
    @Response() response: {action: 'DONE' | 'WRONG_PASSWORD',}
    ) {
    const { login, password } = body;
    const user = await this.userService.login(login, password);

    this.setRefreshTokenToken(response, user).send({
      action: user ? 'DONE' : 'WRONG_PASSWORD'
    })
  }

  @Get('/logout')
  public logout(@Param('id') id: ObjectId) {
    return this.userService.logout();
  }

  @Get('/refresh')
  public refresh(@Param('id') id: ObjectId) {
    return this.userService.logout();
  }

  private setRefreshTokenToken(response: any, user: UserDto): any {
    return response.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 100, httpOnly: true});
  }
}
