import { Model } from 'mongoose';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FileService, FileType } from './file/file.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { MailService } from '../services/mail/mail.service';
import bcrypt from 'bcryptjs'
import { TokenService } from './services/token/token.service';
import { UserDto } from './dto/user-public.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import ApiError from '../exception/api-error/api-error';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
    private mailService: MailService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {
  }

  async create(dto: CreateUserDto, picture): Promise<any> {
    const condidateMail = await this.userModel.findOne({email: dto.email});
    const condidatePhone = await this.userModel.findOne({email: dto.email});
    if (!condidateMail && !condidatePhone) {
      const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
      dto.password = await bcrypt.hash(dto.password, 3);

      const activationLink = uuidv4();
      const date = new Date();
      const creatUser = await this.userModel.create(
        {
          ...dto,
          listens: 0,
          picture: picturePath,
          activationLink: activationLink,
          lastActivity: date,
          created: date,
        })


      this.mailService.sendActivationMail(dto.email, `${this.configService.get('DOMAIN')}/api/user/activate?id=${activationLink}`);

      const userDto = new UserDto(creatUser);
      const tokens = this.tokenService.generateTokens({...userDto});
      await this.tokenService.saveToken(userDto.id, tokens);

      return  {
        ...userDto,
        ...tokens
      };
    } else {
      console.log(4)
      const errorContactType = condidatePhone ? `c телефоном ${dto.phone}` : `c почтой ${dto.email}`;
      // throw new HttpException(`Пользователь ${errorContactType} существует`, HttpStatus.FORBIDDEN);
      throw new Error(`Пользователь ${errorContactType} существует`)
    }
  }

  async login(dto: UserLoginDto): Promise<User> {
    return await this.userModel.create({});
  }

  async logout(): Promise<User> {
    return await this.userModel.create({});
  }

  async activate(link: string): Promise<User> {
    const activatedCandidate = await this.userModel.findOne({activationLink: link});
    if (activatedCandidate) {
      activatedCandidate.isActivated = true;
      activatedCandidate.activationLink = null;
    } else {
      throw new ApiError(400, 'Некорректная ссылка активации')
    }
    return await activatedCandidate.save();
  }

  async deleteAllUsers(): Promise<null> {
    if (this.configService.get('MODE') === 'DEV') {
      await this.tokenService.removeAll();
      await this.userModel.deleteMany();
    }
    return null;
  }
}
