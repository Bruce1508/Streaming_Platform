import mongoose from "mongoose";
declare const friendRequest: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "accepted";
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "accepted";
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "accepted";
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "accepted";
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "accepted";
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "pending" | "accepted";
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default friendRequest;
//# sourceMappingURL=friendRequest.d.ts.map