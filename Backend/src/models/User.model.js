import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        min: 3,
        max: 12
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 5,
        max: 10
    }
}, {timestamps: true})

userSchema.plugin(mongooseAggregatePaginate)

export const User = mongoose.model("User", userSchema)