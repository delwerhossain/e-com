import { IUser } from './users.interface';
import { UserModel } from './users.model';
import { UserValidation } from './users.validation';
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      emailVerified,
      passwordHash,
      profile,
      communicationPreferences,
    } = req.body;

    passwordHash= bcrypt.hashSync(passwordHash, 10);
    const data: IUser = {
      email,
      emailVerified,
      passwordHash,
      profile,
      communicationPreferences,
    };
    const ZodValidation = UserValidation.userValidation.parse(data);
    const result = await UserModel.create(ZodValidation);
  } catch (error: any) {}
};
