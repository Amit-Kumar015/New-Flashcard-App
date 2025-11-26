import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 12
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: "Deck"
    }]
}, {timestamps: true})

userSchema.plugin(mongooseAggregatePaginate)

export const User = mongoose.model("User", userSchema)