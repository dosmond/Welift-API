import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly secretsWhiteList: string[];

  constructor() {
    this.secretsWhiteList = [
      'GOOGLE_PLACES_API_KEY',
      'CHECKR_API_KEY',
      'FIREBASE_API_KEY',
    ];
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async retrieveSecrets(secrets: string[]): Promise<any> {
    const values = {};
    secrets?.forEach((secret) => {
      if (this.secretsWhiteList.includes(secret))
        values[secret] = process.env[secret];
      else
        values['error'] = 'Some of the secrets you requested are unavailable.';
    });

    return new Promise((resolve) => {
      resolve(values);
    });
  }
}
