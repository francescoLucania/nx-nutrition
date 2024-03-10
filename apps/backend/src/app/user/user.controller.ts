import { Response, Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ObjectId } from 'mongoose';


@Controller('/user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
  ]))
  async create(
    @UploadedFiles() avatar,
    @Body() dto: CreateUserDto,
    @Response() res,
  ) {
    try {
      const picture = avatar?.avatar[0];
      const userData = await this.userService.create({
        ...dto,
      }, picture);
      // @ts-ignore
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 100, httpOnly: true})

      return res.send(userData);
    } catch (e) {
      throw new Error(e);
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
