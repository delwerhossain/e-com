import { IAdmin } from "../app/modules/Admin/admin.interface";

// Utility function to validate email format
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const checkForSensitiveFieldUpdate = (
  data: Partial<IAdmin>,
  sensitiveFields: string[],
) => {
  const attemptedSensitiveFields = Object.keys(data).filter(field =>
    sensitiveFields.includes(field),
  );

  if (attemptedSensitiveFields.length > 0) {
    throw new Error(
      `Permission denied: You cannot update the following fields: ${attemptedSensitiveFields.join(', ')}`,
    );
  }
};
