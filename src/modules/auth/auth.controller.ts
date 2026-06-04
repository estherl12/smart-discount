import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EditProfileDto } from './dto/edit-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('/signup')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }

  @PublicRoute()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.login(req.user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user!.id);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return this.authService.changePassword(req.user!.id, changePasswordDto);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Body() editProfileDto: EditProfileDto, @Req() req: Request) {
    return this.authService.updateProfile(req.user!.id, editProfileDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
