import mongoose, {Schema} from "mongoose";

const deckSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    visible: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: "Card"
    }]
}, {timestamps: true})

deckSchema.index({name : 1})
deckSchema.index({name: 1, visible: 1})
deckSchema.index({user: 1})

export const Deck = mongoose.model("Deck", deckSchema)