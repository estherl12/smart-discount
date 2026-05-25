import type { USER_ROLE } from 'src/modules/user/enums/user-role.enum';

export interface IAuthUser {
  id: string;
  email: string;
  role: USER_ROLE;
  shopId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
