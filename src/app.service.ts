import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public async retrieveSecrets(secrets: string[]): Promise<any> {
    const values = {};
    secrets?.forEach((secret) => {
      values[secret] = process.env[secret];
    });

    return new Promise((resolve, reject) => {
      resolve(values);
    });
  }
}
