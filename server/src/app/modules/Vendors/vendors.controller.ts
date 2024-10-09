import { Request, Response } from 'express';
import { VendorService } from './vendors.services';
import sendResponse from '../../../shared/sendResponse';
import { passwordHashing } from '../../../helpers/passHandle';
import catchAsync from '../../../shared/catchAsync';
import { VendorValidation } from './vendors.validation';
import { IVendor } from './vendors.interface';

const createVendor = catchAsync(async (req: Request, res: Response) => {
  const { email, passwordHash, emailVerified, phoneNumber } = req.body;

  // Hash the password with correct salt rounds
  const hashedPassword = await passwordHashing(passwordHash);

  // Create the vendor object
  const data: IVendor = {
    email,
    phoneNumber: phoneNumber,
    emailVerified: emailVerified ?? false, // Default to false if not provided
    passwordHash: hashedPassword,
    role: 'vendor',
    isActive: false,
  };

  // Validate the vendor data with Zod
  const validatedData = VendorValidation.vendorValidation.parse(data);

  // Create the vendor in the database
  const result = await VendorService.createVendorInToDB(validatedData);

  // Return the created vendor, excluding sensitive information like password
  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Vendor created successfully',
    data: {
      email: result.email,
      emailVerified: result.emailVerified,
      phoneNumber: result?.phoneNumber,
    },
  });
});
const getAllVendors = catchAsync(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    businessName,
    email,
    contactEmail,
    phoneNumber,
    publicPhone,
    taxId,
    businessCategory,
    isActive,
    ratingsFrom,
    ratingsTo,
    reviewCountFrom,
    reviewCountTo,
    createdFrom,
    createdTo,
    isDelete,
    country,
    city,
    state,
    hasSocialMedia,
    hasWebsite,
    hasAvatar,
    lastLoginFrom,
    lastLoginTo,
    ...other
  } = req.query;

  const allowedQueryParams = [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
    'businessName',
    'email',
    'contactEmail',
    'phoneNumber',
    'publicPhone',
    'taxId',
    'businessCategory',
    'isActive',
    'ratingsFrom',
    'ratingsTo',
    'reviewCountFrom',
    'reviewCountTo',
    'createdFrom',
    'createdTo',
    'isDelete',
    'country',
    'city',
    'state',
    'hasSocialMedia',
    'hasWebsite',
    'hasAvatar',
    'lastLoginFrom',
    'lastLoginTo',
  ];

  // Validate for invalid query parameters
  const invalidParams = Object.keys(req.query).filter(
    param => !allowedQueryParams.includes(param),
  );
  if (invalidParams.length > 0) {
    throw new Error(`Invalid query parameters: ${invalidParams.join(', ')}`);
  }

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  // Only search for vendors
  const role = 'vendor';
  const isAdmin = false; // Use JWT to validate this

  const filter: any = {};
  if (role) filter.role = role;
  if (businessName)
    filter['profile.businessName'] = new RegExp(businessName as string, 'i');
  if (taxId) filter['profile.taxId'] = new RegExp(taxId as string, 'i');
  if (email) filter.email = new RegExp(email as string, 'i');
  if (contactEmail)
    filter['profile.contactInfo.contactEmail'] = new RegExp(
      contactEmail as string,
      'i',
    );
  if (publicPhone)
    filter['profile.contactInfo.publicPhone'] = new RegExp(
      publicPhone as string,
      'i',
    );
  if (phoneNumber) filter.phoneNumber = new RegExp(phoneNumber as string, 'i');
  if (businessCategory) filter['profile.businessCategoryID'] = businessCategory;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // Rating filters
  if (ratingsFrom || ratingsTo) {
    filter['profile.ratings.averageRating'] = {
      ...(ratingsFrom && { $gte: parseFloat(ratingsFrom as string) }),
      ...(ratingsTo && { $lte: parseFloat(ratingsTo as string) }),
    };
  }

  // Review count filters
  if (reviewCountFrom || reviewCountTo) {
    filter['profile.ratings.reviewCount'] = {
      ...(reviewCountFrom && {
        $gte: parseInt(reviewCountFrom as string, 10),
      }),
      ...(reviewCountTo && { $lte: parseInt(reviewCountTo as string, 10) }),
    };
  }

  // Date filters for vendor creation
  if (createdFrom || createdTo) {
    filter.createdAt = {
      ...(createdFrom && { $gte: new Date(createdFrom as string) }),
      ...(createdTo && { $lte: new Date(createdTo as string) }),
    };
  }

  // Last login date filters
  if (lastLoginFrom || lastLoginTo) {
    filter['lastLogin.timestamp'] = {
      ...(lastLoginFrom && { $gte: new Date(lastLoginFrom as string) }),
      ...(lastLoginTo && { $lte: new Date(lastLoginTo as string) }),
    };
  }

  // Country, City, and State filters
  if (country) filter['profile.contactInfo.contactAddress.country'] = country;
  if (city) filter['profile.contactInfo.contactAddress.city'] = city;
  if (state) filter['profile.contactInfo.contactAddress.state'] = state;

  // Filter by social media presence
  if (hasSocialMedia === 'true') {
    filter.$or = [
      { 'profile.socialMediaLinks.facebook': { $exists: true, $ne: '' } },
      { 'profile.socialMediaLinks.twitter': { $exists: true, $ne: '' } },
      { 'profile.socialMediaLinks.instagram': { $exists: true, $ne: '' } },
    ];
  }

  // Filter by website presence
  if (hasWebsite === 'true')
    filter['profile.websiteUrl'] = { $exists: true, $ne: '' };

  // Filter by avatar presence
  if (hasAvatar === 'true')
    filter['profile.avatarUrl'] = { $exists: true, $ne: '' };

  // Soft delete filter
  if (isDelete === 'false') {
    filter.isDelete = { $ne: true };
  } else if (isDelete === 'true') {
    filter.isDelete = { $ne: false };
  }

  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  // Use optimized DB query
  const result = await VendorService.getAllVendorsInToDB(
    filter,
    sort,
    pageNumber,
    limitNumber,
    { isAdmin },
  );

  const totalPages = Math.ceil(result.total / limitNumber);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendors retrieved successfully',
    meta: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalRecords: result.total,
      totalPages,
      hasPrevPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
    },
    data: result.data,
  });
});

const getAVendor = catchAsync(async (req: Request, res: Response) => {
  const { id, email } = req.query;

  // Ensure at least one of id or email is provided
  if (!id && !email) {
    throw new Error(
      'Please provide either an ID or an email to search for a vendor.',
    );
  }

  // Fetch the vendor from the database using either ID or email
  const result = await VendorService.getAVendorInToDB(
    id as string,
    email as string,
  );

  // If the vendor is not found, return a 404 response
  if (!result) {
    throw new Error('Vendor not found');
  }

  // If the vendor is found, return the safe vendor information with a 200 status

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor retrieved successfully',
    data: result,
  });
});

const updateAVendor = catchAsync(async (req: Request, res: Response) => {
  const vendorID = req.params.id;
  const updateData = req.body;

  // Initialize update operations object
  const updateOperations: any = {};
  // Validate the entire update data using Zod (ensures strict validation)
  const validatedData: any =
    VendorValidation.vendorUpdateValidation.parse(updateData);

  // Handle profile data if present
  if (validatedData.profile) {
    Object.entries(validatedData.profile).forEach(([key, value]) => {
      if (key === 'contactInfo' && value) {
        // Nested contactInfo handling
        Object.entries(value).forEach(([contactKey, contactValue]) => {
          if (contactKey === 'contactAddress' && contactValue) {
            // Nested contactAddress handling
            Object.entries(contactValue).forEach(
              ([addressKey, addressValue]) => {
                updateOperations[
                  `profile.contactInfo.contactAddress.${addressKey}`
                ] = addressValue;
              },
            );
          } else {
            updateOperations[`profile.contactInfo.${contactKey}`] =
              contactValue;
          }
        });
      } else if (key === 'socialMediaLinks' && value) {
        // Nested social media links handling
        Object.entries(value).forEach(([socialKey, socialValue]) => {
          updateOperations[`profile.socialMediaLinks.${socialKey}`] =
            socialValue;
        });
      } else {
        updateOperations[`profile.${key}`] = value;
      }
    });
  }

  // Handle communicationPreferences if present
  if (validatedData.communicationPreferences) {
    Object.entries(validatedData.communicationPreferences).forEach(
      ([key, value]) => {
        updateOperations[`communicationPreferences.${key}`] = value;
      },
    );
  }

  // Handle password update if provided
  if (validatedData.passwordHash) {
    updateOperations.passwordHash = await passwordHashing(
      validatedData.passwordHash,
    );
  }

  // Handle other primitive data
  ['email', 'phoneNumber', 'emailVerified'].forEach(field => {
    if (validatedData[field] !== undefined) {
      updateOperations[field] = validatedData[field];
    }
  });

  // Ensure that at least one update operation is present
  if (Object.keys(updateOperations).length === 0) {
    throw new Error('No update operations provided');
  }

  // Update the vendor in the database
  const updatedVendor = await VendorService.updateAVendorInToDB(
    vendorID,
    updateOperations,
  );

  if (!updatedVendor) {
    throw new Error('Vendor not found');
  }

  // Return the updated vendor data
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor updated successfully!',
    data: updatedVendor,
  });
});

//! this route only for admin
const deleteAVendor = catchAsync(async (req: Request, res: Response) => {
  const vendorID = req.params.id;
  //! todo get from JWT + middleware isAdmin
  const isAdmin = true;

  const deletedVendor = await VendorService.deleteAVendorInToDB(
    vendorID,
    isAdmin,
  );
  if (!deletedVendor) {
    throw new Error('Vendor not found');
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor deleted successfully!',
  });
});

const vendorLastLogin = catchAsync(async (req: Request, res: Response) => {
  // Get IP address from 'x-forwarded-for' or fallback to 'req.socket.remoteAddress'
  let ip =
    (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

  // If using IPv6 (::1), convert it to IPv4 (127.0.0.1)
  if (ip === '::1') {
    ip = '127.0.0.1';
  }

  // Handle cases where 'x-forwarded-for' may return multiple IPs
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  const { id } = req.params;

  // You can log the IP address or use it as needed
  console.log({ ip });

  const result = await VendorService.vendorLastLoginInToDB(id, ip);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor last login updated successfully',
    data: result,
  });
});

export const VendorController = {
  getAllVendors,
  createVendor,
  getAVendor,
  updateAVendor,
  deleteAVendor,
  vendorLastLogin,
};
