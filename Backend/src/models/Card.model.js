import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CardSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    tag: {
        type: String,
        trim: true
    },
    hint: {
        type: String,
        trim: true
    },
    easeFactor: {
        type: Number,
        default: 2.5,
        min: 1.3,
    },
    interval: {
        type: Number,
        default: 1,
    },
    repetitions: {
        type: Number,
        default: 0,
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    deck : {
        type: Schema.Types.ObjectId,
        ref: "Deck",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

CardSchema.plugin(mongooseAggregatePaginate)

export const Card = mongoose.model("Card", CardSchema)