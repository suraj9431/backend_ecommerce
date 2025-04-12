import mongoose from "mongoose";
// import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: [true, 'answer is required']
        },
        role: {
            type: String,
            default: 'user',
        },
        profilePic: {
            public_id: { type: String },
            url: { type: String },
        },
    },
    { timestamps: true }
);
// userSchema.pre("save", async function () {
//     this.password = await bcrypt.hash(this.password, 10)
// })
const userModel = mongoose.model("user", userSchema);
export default userModel;

