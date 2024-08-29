import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { FileModule } from './user/file/file.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static ') }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get('DATABASE_URL'),
          user: config.get('DATABASE_LOGIN'),
          pass: config.get('DATABASE_PASS'),
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    FileModule,
  ],
})
export class AppModule {}
