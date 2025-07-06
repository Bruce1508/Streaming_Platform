"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const friendRequestSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", //tham chiếu đến model "User", cho phép dùng 
        required: true,
    },
    recipient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
    },
}, {
    timestamps: true,
});
const friendRequest = mongoose_1.default.model("FriendRequest", friendRequestSchema);
exports.default = friendRequest;
//# sourceMappingURL=friendRequest.js.map