import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class CheckrGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const sig = request.get('X-Checkr-Signature');

    try {
      const hmac = createHmac('sha256', process.env.CHECKR_API_KEY)
        .update(JSON.stringify(request.body))
        .digest('hex');

      console.log(hmac, sig);

      if (sig === hmac) return true;
      else {
        console.log("Signature doesn't match!");
        throw new Error("Signature doesn't match!");
      }
    } catch (err) {
      console.log(err);
    }
  }
}
