import { ICurrentUser } from '../decorators/user.decorator';

declare global {
  namespace Express {
    interface Request {
      user: ICurrentUser;
      requestId?: string;
    }
  }
}
