import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js'
import { rejects } from 'assert';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.USERPOOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID
    });
  }

  registerUser(registerRequest: {
    username: string,
    email: string,
    password: string,
  }) {
    const { username, email, password } = registerRequest;

    return new Promise((res, rej) => {
      return this.userPool.signUp(username, password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (error, result) => {
          if (!result)
            rej(error);
          else
            res(result);
        })
    })
  }

  authenticateUser(user: { username: string, password: string }) {
    const { username, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    const userData = {
      Username: username,
      Pool: this.userPool
    };

    const newUser = new CognitoUser(userData)

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve(result)
        },
        onFailure: err => {
          reject(err)
        }
      })
    })
  }
}
