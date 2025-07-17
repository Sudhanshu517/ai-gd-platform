import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// 1. Define your schema fields
export interface IUser {
  username: string;
  email: string;
  password: string;
}

// 2. Extend Document, explicitly typing _id as ObjectId
export interface IUserDocument extends IUser, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

// 3. Define schema based on IUserDocument (so TS knows about _id)
const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// 4. Export the model with correct typing
const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);
export default User;
