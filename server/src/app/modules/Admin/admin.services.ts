import { AdminModel } from "./admin.model";

const getAllAdminInToDB = async () => {
    const admin = await AdminModel.find();
    return admin;
};
const getAdminById = async (id: string) => {    
    const admin = await AdminModel.findById(id);
    return admin;
};

const createAdminInToDB = async (payload: any) => {
    const admin = await AdminModel.create(payload);
    return admin;
};


const updateAdminInDB = async (id: string, payload: any) => {
    const admin = await AdminModel.findByIdAndUpdate(id, payload, { new: true });
    return admin;
};
const deleteAdminInDB = async (id: string) => {
    const admin = await AdminModel.findByIdAndDelete(id);
    return admin;
};
export const AdminServices = {
    getAllAdminInToDB,
    getAdminById,
    createAdminInToDB,
    updateAdminInDB,
    deleteAdminInDB,
}