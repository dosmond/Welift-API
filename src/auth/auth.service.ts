import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

import { Credentials, config, CognitoIdentityServiceProvider } from 'aws-sdk';
import { PinoLogger } from 'nestjs-pino';

// This should only be necessary for local dev work.
if (process.env.NODE_ENV == 'local') {
  const creds = new Credentials(
    process.env.AWS_CRED_KEY,
    process.env.AWS_CRED_SECRET,
  );
  config.credentials = creds;
}

config.update({ region: 'us-east-1' });

@Injectable()
export class AuthService {
  private userPools: { [key: string]: CognitoUserPool };

  constructor(private readonly logger: PinoLogger) {
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

  public registerUser(registerRequest: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    appName: string;
    phoneNumber: string;
  }) {
    const {
      username,
      email,
      password,
      appName,
      phoneNumber,
      firstName,
      lastName,
    } = registerRequest;

    return new Promise((res, rej) => {
      const userPool = this.userPools[appName];

      if (!userPool) {
        throw new BadRequestException(`App name: ${appName} does not exist`);
      }

      return userPool.signUp(
        username,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber,
          }),
          new CognitoUserAttribute({
            Name: 'family_name',
            Value: lastName,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: firstName,
          }),
        ],

        null,
        (error, result) => {
          if (!result) rej(error);
          else res(result);
        },
      );
    });
  }

  public async refresh(
    refreshToken: string,
    appName: string,
    username: string,
  ) {
    const userPool = this.userPools[appName];

    if (!userPool) {
      throw new BadRequestException(`App name: ${appName} does not exist`);
    }

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const refresh = new CognitoRefreshToken({ RefreshToken: refreshToken });

    return new Promise((resolve, reject) => {
      return user.refreshSession(refresh, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public authenticateUser(request: {
    username: string;
    password: string;
    appName: string;
    newPassword: string;
  }) {
    const { username, password, appName, newPassword } = request;

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
        newPasswordRequired: (userAttributes) => {
          delete userAttributes.email_verified;
          delete userAttributes.phone_number_verified;

          userAttributes.name = authenticationDetails.getUsername();
          newUser.completeNewPasswordChallenge(newPassword, userAttributes, {
            onSuccess: (result) => {
              resolve(result);
            },
            onFailure: (err) => {
              reject(err);
            },
          });
        },
      });
    });
  }

  public forgotPassword(request: { username: string; appName: string }) {
    const { username, appName } = request;

    const userPool = this.userPools[appName];

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return user.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  public confirmPassword(request: {
    code: string;
    username: string;
    password: string;
    appName: string;
  }) {
    const { code, username, password, appName } = request;

    const userPool = this.userPools[appName];

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const user = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return user.confirmPassword(code, password, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  public async deleteUser(request: { appName: string; username: string }) {
    const userPool = this.userPools[request.appName];

    const cognito = new CognitoIdentityServiceProvider();

    await cognito
      .adminDeleteUser({
        UserPoolId: userPool.getUserPoolId(),
        Username: request.username,
      })
      .promise();
  }
}
