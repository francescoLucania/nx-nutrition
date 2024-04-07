import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FileService, FileType } from './file/file.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../services/mail/mail.service';
import bcrypt from 'bcryptjs';
import { TokenService } from './services/token/token.service';
import { UserDto } from './dto/user-public.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import ValidationException from '../exception/validation/validation';

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

  async create(dto: CreateUserDto): Promise<UserDto> {
    const searchByEmail = await this.searchUser({email: dto.email});
    const searchByPhone = await this.searchUser({email: dto.email});
    const user = searchByEmail || searchByPhone;
    if (!user) {
      let picturePath;
      dto.password = await bcrypt.hash(dto.password, 3);

      const activationLink = uuidv4();
      const date = new Date();
      const creatUser = await this.userModel.create(
        {
          ...dto,
          listens: 0,
          picture: picturePath ? picturePath : 'unknown.jpg',
          activationLink: activationLink,
          lastActivity: date,
          created: date,
        })


      this.mailService.sendActivationMail(
        dto.email,
        `${this.configService.get('DOMAIN')}/api/user/activate?id=${activationLink}`
      );

      const user = new UserDto(creatUser);
      return await this.buildUserAuthData(user);
    } else {
      const errorContactType = searchByPhone ? `c телефоном ${dto.phone}` : `c почтой ${dto.email}`;
      throw new ValidationException(`Пользователь ${errorContactType} уже зарегестрирован`)
    }
  }

  saveAvatar(picture: any) {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
  }

  async login(login: string, password: string): Promise<UserDto> {
    const userSearchByEmail = await this.searchUser({email: login});

    if (
      userSearchByEmail &&
      await this.loginPasswordEquals(userSearchByEmail, password)
    ) {
      return this.buildUserAuthData(new UserDto(userSearchByEmail));
    }

    const userSearchByPhone = await this.searchUser({phone: login});

    if (
      userSearchByPhone &&
      await this.loginPasswordEquals(userSearchByPhone, password)
    ) {
      return this.buildUserAuthData(new UserDto(userSearchByPhone));
    }

    if (!userSearchByEmail && !userSearchByPhone) {
      throw new ValidationException(`USER_NOT_FOUND`);
    } else {
      throw new ValidationException(`BAD_PASSWORD`)
    }
  }

  private async buildUserAuthData(user: UserDto) {
    const tokens = this.tokenService.generateTokens({...user});
    await this.tokenService.saveToken(user.id, tokens);
    return {
      ...user,
      ...tokens
    }
  }

  private async loginPasswordEquals(user: User, password: string): Promise<boolean> {
    const result = await bcrypt.compare(password, user.password);
    return result;
  }

  private async searchUser(searchParam: Partial<CreateUserDto>): Promise<User | null> {
    const user = await this.userModel.findOne(searchParam);
    return user ? user : null
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
      throw new Error('INCORRECT_LINK')
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
