import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {
  private userPools: { [key: string]: CognitoUserPool };

  constructor() {
    this.userPools = {
      landing: new CognitoUserPool({
        UserPoolId: process.env.LANDING_USERPOOL_ID,
        ClientId: process.env.LANDING_CLIENT_ID,
      }),
      partner: new CognitoUserPool({
        UserPoolId: process.env.PARTNER_USERPOOL_ID,
        ClientId: process.env.PARTNER_CLIENT_ID,
      }),
      mobile: new CognitoUserPool({
        UserPoolId: process.env.MOBILE_USERPOOL_ID,
        ClientId: process.env.MOBILE_CLIENT_ID,
      }),
      admin: new CognitoUserPool({
        UserPoolId: process.env.ADMIN_USERPOOL_ID,
        ClientId: process.env.ADMIN_CLIENT_ID,
      }),
    };
  }

  registerUser(registerRequest: {
    username: string;
    email: string;
    password: string;
    appName: string;
  }) {
    const { username, email, password, appName } = registerRequest;

    return new Promise((res, rej) => {
      const userPool = this.userPools[appName];

      if (!userPool) {
        throw new BadRequestException(`App name: ${appName} does not exist`);
      }

      return userPool.signUp(
        username,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (error, result) => {
          if (!result) rej(error);
          else res(result);
        },
      );
    });
  }

  authenticateUser(request: {
    username: string;
    password: string;
    appName: string;
  }) {
    const { username, password, appName } = request;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userPool = this.userPools[appName];

    if (!userPool)
      throw new BadRequestException(`App name: ${appName} does not exist`);

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
