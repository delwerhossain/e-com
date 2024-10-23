// pass hash handle

import config from '../app/config';
import bcrypt from 'bcrypt';

export const passwordHashing = async (password: string) => {
  //! todo => salt rounds value
  // Parse salt rounds with a fallback to default value if parsing fails
  const saltRounds = parseInt(config.bcrypt_salt_rounds as string, 10) || 12;

  // Hash the password with correct salt rounds
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};
