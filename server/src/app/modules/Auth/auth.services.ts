import AppError from '../../../Errors/AppError';
import { User } from '../Users/users.model';
import { ILoginUser } from './auth.interface';
import httpStatus from 'http-status';

const loginUser = async(payload: ILoginUser) => {
  const { email, password } = payload;
  const userData  = await User.isUserExistsByCustomId(email);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  const isDelete = userData?.isDelete;

  if (isDelete) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is not found !');
  }
  const isActive = userData?.isActive;
  if (!isActive) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is not found !');
  }

  if (!(await User.isPasswordMatched(password , userData?.passwordHash))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password !');    
  }
  // remain JWT implementation


};

export const AuthServices = {
  loginUser,
};
