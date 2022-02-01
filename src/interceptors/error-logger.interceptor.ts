import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorLoggerInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(ErrorLoggerInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => {
          const response = context.switchToHttp().getResponse();

          const isFastifyResponse = response.raw !== undefined;

          if (isFastifyResponse) {
            response.raw.err = error;
          } else {
            response.err = error;
          }

          this.logger.error(error);
          return error;
        });
      }),
    );
  }
}
