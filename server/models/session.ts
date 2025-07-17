import mongoose, {Document, Schema} from 'mongoose';

export interface ISession extends Document{
    topic: string;
    createdBy: string; //userId
    participants: Array<string>;
    aicount: number;
    scheduledAt: Date;   
}

const sessionSchema = new Schema<ISession>({
        topic: {type: String, required: true},
        createdBy : {type: String, required: true},
        participants: [{ type:String }],
        aicount: {type: Number, default:0},
        scheduledAt:{type:Date, required: true},
},{timestamps:true});

export default mongoose.model<ISession>('Session', sessionSchema);