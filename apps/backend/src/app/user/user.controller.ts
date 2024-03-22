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


@Controller('/user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @UsePipes(ValidationPipe)
  @Post('/create')
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'avatar', maxCount: 1 },
  // ]))
  async create(
    // @UploadedFiles() avatar,
    @Body() dto: CreateUserDto,
    @Response() res,
  ) {
    console.log('controller dto', dto);
    // const picture = avatar?.avatar[0];
    const userData = await this.userService.create({
      ...dto,
    });
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 100, httpOnly: true})

    return res.send(userData);
  }

  @UsePipes(ValidationPipe)
  @Post('/uploadAvatar')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
  ]))
  async uploadAvatar(
    @UploadedFiles() avatar,
    @Response() res,
  ) {

    const userData = { avatar: '...' }
    return res.send(userData);
  }

  @Get('/activate')
  async activate(
    @Query() query: {id: string},
    @Response() res,
  ) {
    console.log('link', query.id)
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
  deleteAllUsers() {
    return this.userService.deleteAllUsers();
  }

  @Post('/login')
  login(@Body() dto: UserLoginDto) {
    return this.userService.login(dto);
  }

  @Get('/logout')
  logout(@Param('id') id: ObjectId) {
    return this.userService.logout();
  }

  @Get('/refresh')
  refresh(@Param('id') id: ObjectId) {
    return this.userService.logout();
  }
}
