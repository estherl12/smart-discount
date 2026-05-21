import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

//
import { AuthService } from '../auth.service';
// import { I18nService } from 'nestjs-i18n';
import { IAuthUser } from '../../../types/express';

//
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    // private readonly i18n: I18nService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<IAuthUser> {
    const user = await this.authService.validateUser(email, password);

    // if (!user)
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    //   throw new UnauthorizedException(this.i18n.t('error.UNAUTHORIZE'));

    if (!user)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      throw new UnauthorizedException('Unauthenticated or invalid');

    return user;
  }
}
