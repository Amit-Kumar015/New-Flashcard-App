import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../models/User.model.js"
import {Card} from "../models/Card.model.js"
import {Deck} from "../models/deck.model.js"
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js"
import catchAsync from "../utils/catchAsync.js";


const createCard = catchAsync(async (req, res, next) => {
    // get data, validate it
    // authenticate user
    // deck is must to come from user
    // check if the deck with provided deck name is present in db
    // if present create card in that deck
    // else create deck with provided name and add the card

    const {question, answer, tag, hint, deck} = req.body

    if(!question || !answer){
        return next(new AppError("send all details of card", 400))
    }

    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }
    
    let existDeck = await Deck.findOne({
        user: req.user._id,
        name: deck
    })

    if(!existDeck){
        existDeck = await Deck.create({
            name: deck,
            visible: true,
            user: req.user._id,
            cards: []
        })
    }

    const card = await Card.create({
        question,
        answer,
        tag,
        hint,
        user: req.user._id,
        deck: existDeck._id
    })

    const cardData = {
        id: card._id,
        question: card.question,
        answer: card.answer,
        tag: card.tag,
        hint: card.hint,
        user: card.user,
        deck: card.deck,
        reviewDate: card.reviewDate,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt
    }

    existDeck.cards.push(card._id)
    await existDeck.save()

    return sendResponse(res, 200, "card created successfully", cardData)
})

const getAllCards = catchAsync(async (req, res, next) => {
    // authenticate user
    // user exist in db
    // fetch all cards of user
    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }

    const id = req.user._id

    const user = await User.findById(id)
    if(!user){
        return next(new AppError("user does not exist in db", 404))
    }

    const cards = await Card.aggregate([
        {
            $match: {user: new mongoose.Types.ObjectId(id)}
        },
        {
            $lookup: {
                from: 'decks',
                localField: 'deck',
                foreignField: '_id',
                as: 'deckInfo'
            }
        },
        {
            $unwind: {
                path: '$deckInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                question: 1,
                answer: 1,
                tag: 1,
                hint: 1,
                deck: '$deckInfo.name',
                reviewDate: 1,
                createdAt: 1
            }
        }
    ])

    return sendResponse(res, 200, "cards fetched successfully", cards)
})

const pendingCards = catchAsync(async (req, res, next) => {
    // authenticate user
    // user exist in db
    // fetch all pending cards of user
    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }

    const id = req.user._id

    const user = await User.findById(id)
    if(!user){
        return next(new AppError("user does not exist in db", 404))
    }

    const cards = await Card.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(id),
                reviewDate: { $lte: new Date()}
            }
        },
        {
            $lookup: {
                from: 'decks',
                localField: 'deck',
                foreignField: '_id',
                as: 'deckInfo'
            }
        },
        {
            $unwind: {
                path: '$deckInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: {reviewDate: 1}
        },
        {
            $project: {
                question: 1,
                answer: 1,
                tag: 1,
                deck: '$deckInfo.name',
                hint: 1,
                reviewDate: 1
            }
        }
    ])
    
    return sendResponse(res, 200, "cards fetched successfully", cards)
})

const updateCard = catchAsync(async (req, res, next) => {
    // take id of card
    // take updated data
    // authenticate user - middleware
    // check if card exist
    // if deck is changed then check if new deck exist
    // update

    const {id} = req.params
    const {newQuestion, newAnswer, newTag, newDeck, newHint} = req.body

    if(!id || !isValidObjectId(id)){
        return next(new AppError("provide valid card id", 400))
    }

    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }
    
    const card = await Card.findById(id)
    if(!card){
        return next(new AppError("card not found", 404))
    }
    
    if(card.user.toString() !== req.user._id.toString()) {
        return next(new AppError("Not allowed to update this card", 403));
    }

    let deck = null
    if(newDeck){
        deck = await Deck.findOne({
            $or: [
                {_id: id ? newDeck : null},
                {name: newDeck}
            ],
            user: req.user._id
        })

        if(!deck){
            return next(new AppError("deck not found", 404))
        }
    }

    card.question = newQuestion || card.question
    card.answer = newAnswer || card.answer
    card.tag = newTag || card.tag
    card.hint = newHint || card.hint
    if(deck) card.deck = deck._id 

    const updatedCard = await card.save()

    if(!updatedCard){
        return next(new AppError("error while updating card", 500))
    }

    const updatedCardData = {
        id: updatedCard._id,
        question: updatedCard.question,
        answer: updatedCard.answer,
        tag: updatedCard.tag,
        hint: updatedCard.hint,
        user: updatedCard.user,
        deck: updatedCard.deck,
        reviewDate: updatedCard.reviewDate,
        createdAt: updatedCard.createdAt,
        updatedAt: updatedCard.updatedAt
    }

    return sendResponse(res, 200, "updated card successfully", updatedCardData)
})

const deleteCard = catchAsync(async (req, res, next) => {
    // take card id
    // authenticate user - middleware
    // check card exist
    // delete

    const {id} = req.params

    if(!id || !isValidObjectId(id)){
        return next(new AppError("provide valid card id", 400))
    }

    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }

    const card = await Card.findOne({id: id, user: req.user._id})
    if(!card){
        return next(new AppError("card not found"))
    }

    if(card.user.toString() !== req.user._id.toString()){
        return next(new AppError("Not allowed to update this card", 403))
    }

    await Deck.updateOne(
        {_id: card.deck},
        {$pull: {cards: card._id}}
    )

    await Card.findByIdAndDelete(id)
    
    return sendResponse(res, 200, "card deleted successfully", card)
})

const filterCard = catchAsync(async (req, res, next) => {
    // take filter field from params
    // take user id
    // fetch data

    const {tag, deckId} = req.query

    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }
    const id = req.user._id

    const matchQuery = {
        user: new mongoose.Types.ObjectId(id),
    };

    if(tag) matchQuery.tag = tag;
    if(deckId){
        matchQuery.deck = new mongoose.Types.ObjectId(deckId)
    } 

    const cards = await Card.aggregate([
        { $match: matchQuery },
        { $sort: { reviewDate: 1 } }
    ]);

    return sendResponse(res, 200, "cards fetched successfully", cards)
})

const tags = catchAsync(async (req, res, next) => {
    // get user from middleware
    // get all tags

    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }

    const id = req.user._id

    const allTag = await Card.aggregate([
        {
            $match: {user: new mongoose.Types.ObjectId(id)}
        },
        {
            $group: {
                _id: "$tag"
            }
        },
        {
            $project: {_id: 0, tag: "$_id"}
        }
    ])

    return sendResponse(res, 200, "all tags fetched successfully", allTag)
})

const updateReviewDate = catchAsync(async (req, res, next) => {
    // get difficulty from params 1-hard, 2-medium, 3-easy
    // get id of card from params
    // validate id
    // write next review date logic
    // find and update card

    const {difficulty, id} = req.params

    let q = Number(difficulty)
    if(q < 1 || q > 3){
        return next(new AppError("Invalid value", 400))
    }

    if(!id || !isValidObjectId(id)){
        return next(new AppError("provide valid card id", 400))
    }

    if(!req.user || !req.user._id){
        return next(new AppError("Unauthorized - User ID missing", 401))
    }

    const card = await Card.findById(id)

    if(!card){
        return next(new AppError("card not found", 404))
    }
    
    if(card.user.toString() !== req.user._id.toString()) {
        return next(new AppError("Not allowed to update this card", 403));
    }

    const oneDay = 24*60*60*1000

    if(q === 1){
        card.interval = 1
        card.repetitions = 0
        card.reviewDate = new Date(Date.now() + oneDay)
    }
    else{
        if(card.repetitions == 0){
            card.interval = 1
        }
        else if(card.repetitions == 1){
            card.interval = 6
        }
        else{
            card.interval = Math.round(card.interval * card.easeFactor)
        }

        const newEF = card.easeFactor + (0.1 - (3 - q) * (0.08 + (3 - q) * 0.02))
        card.easeFactor = Math.max(newEF, 1.3)

        card.repetitions += 1

        card.reviewDate = new Date(Date.now() + card.interval * oneDay);
    }

    const savedCard = await card.save()

    return sendResponse(res, 200, "Review updated", savedCard)    
})


export {
    createCard,
    getAllCards,
    pendingCards, 
    updateCard, 
    deleteCard,
    filterCard,
    tags,
    updateReviewDate
}