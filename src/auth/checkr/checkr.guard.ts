import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class CheckrGuard implements CanActivate {
  private readonly logger: Logger = new Logger(CheckrGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const sig = request.get('X-Checkr-Signature');

    try {
      const hmac = createHmac('sha256', process.env.CHECKR_API_KEY)
        .update(JSON.stringify(request.body))
        .digest('hex');

      if (sig === hmac) return true;
      else {
        throw new Error("Signature doesn't match!");
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
