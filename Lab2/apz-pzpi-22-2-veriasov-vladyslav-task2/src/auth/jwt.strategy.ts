import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import 'dotenv/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRET
    });
  }

  async validate(payload: any) {
    // const user = await this.userService.findOne(payload.email);
    // if (!user) {
    //     throw new UnauthorizedException();
    //   }

    //   return user;
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
