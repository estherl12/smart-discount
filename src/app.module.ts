import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { typeOrmConfig } from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables accessible globally
    }),
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
