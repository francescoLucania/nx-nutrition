import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from '../../schemas/token.schema';

export type TokenType = 'ACCESS_TOKEN' | 'REFRESH_TOKEN';

export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private configService: ConfigService
  ) {
  }

  public generateTokens(payload): {accessToken: string, refreshToken: string} {
    const accessToken = jwt.sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {expiresIn: '30d'});

    return {
      accessToken,
      refreshToken,
    }
  }
  public async saveToken(userId, tokens) {
    const tokenData = await this.tokenModel.findOne({user: userId})

    console.log('tokens', tokens)

    if (tokenData) {
      console.log('update token tokenData', tokenData)
      tokenData.refreshToken = tokens.refreshToken;
      // console.log('tokens.refreshToken', tokens.refreshToken)
      return tokenData.save();
    }
    return await this.tokenModel.create({ user: userId, refreshToken: tokens.refreshToken });
  }

  async removeToken(refreshToken: string) {
    await this.tokenModel.deleteOne({refreshToken});
    return null;
  }

  async findToken(refreshToken: string): Promise<TokenDocument | null> {
    console.log('findToken refreshToken', refreshToken);
    const result = await this.tokenModel.findOne({refreshToken});
    console.log('result', result);
    return result ? result : null;
  }

  async removeAll(): Promise<null> {
    if (this.configService.get('MODE') === 'DEV') {
      await this.tokenModel.collection.drop();
      return null;
    }
  }

  validateToken(type: TokenType, token: string): TokenDocument {
    try {
      const jwtSecret = type === 'ACCESS_TOKEN' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET'
      return jwt.verify(token, this.configService.get(jwtSecret))
    } catch (e) {
      console.log(e);
      return null
    }
  }
}
