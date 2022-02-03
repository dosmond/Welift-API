export interface User {
  sub: string;
  roles: string;
  email: string;
}

import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  const user: User = req.args[0].user || {};
  return user;
});
