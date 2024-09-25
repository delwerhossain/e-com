import mongoose from 'mongoose';

const OrdersSchema = new mongoose.Schema({});
   
export const OrdersModel = mongoose.model('Orders', OrdersSchema);