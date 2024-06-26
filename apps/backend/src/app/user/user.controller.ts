import {
  Response,
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException, HttpStatus, Query, UsePipes, UseInterceptors, UploadedFiles, Req, UseGuards
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ValidationPipe } from '../pipes/validation/validation';
import { UserDto } from './dto/user-public.dto';
import { AuthGuard } from '../guards/auth/auth';
// import { AuthGuard } from '../guards/auth/auth';


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

  @UsePipes(ValidationPipe)
  @Post('/login')
  public async login(
    @Body() body: UserLoginDto,
    @Response() response: UserDto
    ) {
    const { login, password } = body;
    const user = await this.userService.login(login, password);

    this.setRefreshTokenToken(response, user).send(user);
  }

  @Get('/logout')
  public async logout(
    @Req() request,
    @Response() response,
    ) {
    await this.userService.logout(request.cookies.refreshToken);
    response.clearCookie('refreshToken')
    return response.send({action: 'LOGOUT'});
  }

  @Get('/refresh')
  public async refresh(
    @Req() request,
    @Response() response,
    ) {
    const user = await this.userService.refresh(request.cookies.refreshToken)
    this.setRefreshTokenToken(response, user).send(user);
  }

  @UseGuards(AuthGuard)
  @Get('/getUserData')
  public getUserData(
    @Req() request,
    @Response() response,
  ) {
    return response.send({
      action: 'TEST'
    })
  }

  private setRefreshTokenToken(response: any, user: UserDto): any {
    return response.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 100, httpOnly: true});
  }

  @Get('/deleteAllUsers')
  public deleteAllUsers() {
    return this.userService.deleteAllUsers();
  }
}
