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
    level: {
        type: Number,
        default: 1,
    },
    tag: {
        type: String,
        trim: true
    },
    deck: {
        type: String,
        trim: true,
        default: 'General',
        validate: {
            validator: function(v){
                return v.trim().length > 0
            },
            message: "Deck name cannot be empty."
        }
    },
    hint: {
        type: String,
        trim: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const intervals = [1, 2, 5, 7, 15]

CardSchema.pre('save', function(next){
    if(this.isModified('level')){
        const intervalIndex = Math.min(this.level-1, intervals.length-1)
        this.reviewDate = new Date()
        this.reviewDate.setDate(this.reviewDate.getDate() + intervals[intervalIndex])
    }
    next()
})

CardSchema.plugin(mongooseAggregatePaginate)

export const Card = mongoose.model("Card", CardSchema)