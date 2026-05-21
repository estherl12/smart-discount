// TODO:: Change this with actual user data later on
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User, UserType } from '../modules/user/entities/user.entity';

interface IAuthRole {
  id: number;
  value: string;
  type: string;
  label: string;
}

interface IAuthUser {
  id: string;
  email: string;
  role: UserType;
}

declare namespace Express {
  export interface Request {
    user?: IAuthUser;
  }
}
