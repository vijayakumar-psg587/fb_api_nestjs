import { Injectable, NestMiddleware, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.DEFAULT
})
export class AppCommonMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
