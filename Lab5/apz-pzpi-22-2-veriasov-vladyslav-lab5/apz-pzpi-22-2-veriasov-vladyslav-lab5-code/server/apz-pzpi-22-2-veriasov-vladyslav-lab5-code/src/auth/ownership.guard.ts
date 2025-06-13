// import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class OwnershipGuard implements CanActivate {
//   constructor(private reflector: Reflector, private userService: UserService) {}

//   canActivate(context: ExecutionContext): boolean {
//     console.log('OwnershipGuard');
//     const request = context.switchToHttp().getRequest();
//     console.log(request.user);
//     console.log(request.user.email);
//     console.log(request.params);
//     const user = request.user; // Получаем пользователя из JWT
//     const param = request.params.id || request.params.email; // ID или email из параметров

//     const data = userService.findOne(request.user.email);
    

//     // Если пользователь - ADMIN или MODERATOR, доступ разрешён
//     if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
//       return true;
//     }

//     // Если ID или email в параметрах совпадают с текущим пользователем
//     if (user.id === param || user.email === param ) {
//       return true;
//     }

//     throw new ForbiddenException('You can only access or modify your own data.');
//   }
// }


import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('OwnershipGuard');
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Дані користувача з JWT
    const param = request.params.id || request.params.email; // ID або email з параметрів

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    // Якщо ID немає у JWT, витягуємо його за email
    if (!user.id) {
      const userData = await this.userService.findOne(user.email);
      if (!userData) {
        throw new ForbiddenException('User not found.');
      }
      user.id = userData.id; // Додаємо ID до request.user
    }

    console.log('Request user:', user);
    console.log('Route params:', request.params);

    // Якщо користувач - ADMIN або MODERATOR, доступ дозволений
    if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
      return true;
    }

    // Перевіряємо, чи збігається ID або email
    if (user.id === param || user.email === param) {
      return true;
    }

    throw new ForbiddenException('You can only access or modify your own data.');
  }
}
