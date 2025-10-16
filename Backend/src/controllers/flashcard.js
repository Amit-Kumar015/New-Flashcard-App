import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../models/User.model.js"
import {Card} from "../models/Card.model.js"

const createCard = async (req, res) => {
    try {
        // validate data
        // authenticate user
        // create card
        const {question, answer, tag, deck, hint} = req.body
    
        if(!question || !answer){
            const error = new Error("send all details of card")
            error.status = 400
            throw error
        }
    
        if(!req.user || !req.user._id){
            const error = new Error("Unauthorized - User ID missing")
            error.status = 401
            throw error
        }
        // console.log('user id: ', req.user._id);
    
        const card = await Card.create({
            question,
            answer,
            tag,
            deck,
            hint,
            user: req.user._id
        })
    
        if(!card){
            const error = new Error("error in creating card in db")
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: 'card created successfully',
            card
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const getAllCards = async (req, res) => {
    try {
        // authenticate user
        // user exist in db
        // fetch all cards of user
        if(!req.user || !req.user._id){
            const error = new Error("Unauthorized - User ID missing")
            error.status = 401
            throw error
        }

        const id = req.user._id
        // console.log('user id: ', id);
    
        const user = await User.findById(id)
        if(!user){
            const error = new Error("user does not exist in db")
            error.status = 404
            throw error
        }
    
        const cards = await Card.aggregate([
            {
                $match: {user: new mongoose.Types.ObjectId(id)}
            },
            {
                $project: {
                    question: 1,
                    answer: 1,
                    level: 1,
                    tag: 1,
                    deck: 1,
                    hint: 1,
                    reviewDate: 1,
                    createdAt: 1
                }
            }
        ])
    
        if(cards.length === 0){
            const error = new Error("No cards found")
            error.status = 404
            throw error
        }
    
        if(!cards){
            const error = new Error("error while fetching cards")
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: 'cards fetched successfully',
            data: cards
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const pendingCards = async (req, res) => {
    try {
        // authenticate user
        // user exist in db
        // fetch all pending cards of user
        if(!req.user || !req.user._id){
            const error = new Error("Unauthorized - User ID missing")
            error.status = 401
            throw error
        }

        const id = req.user._id
        // console.log('user id: ', id);
    
        const user = await User.findById(id)
        if(!user){
            const error = new Error("user does not exist in db")
            error.status = 404
            throw error
        }
    
        const cards = await Card.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(id),
                    reviewDate: { $lte: new Date()}
                }
            },
            {
                $sort: {reviewDate: 1}
            },
            {
                $project: {
                    question: 1,
                    answer: 1,
                    level: 1,
                    tag: 1,
                    deck: 1,
                    hint: 1,
                    reviewDate: 1
                }
            }
        ])
    
        if(cards.length === 0){
            const error = new Error("No cards found")
            error.status = 404
            throw error
        }
    
        if(!cards){
            const error = new Error("error while fetching cards")
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: 'cards fetched successfully',
            data: cards
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const updateCard = async (req, res) => {
    try {
        // take id of card
        // take updated data
        // check if card exist
        // authenticate user - middleware
        // update
    
        const {id} = req.params
        const {newQuestion, newAnswer, newLevel, newTag, newDeck, newHint} = req.body
    
        if(!id || !isValidObjectId(id)){
            const error = new Error('provide valid card id')
            error.status = 400
            throw error
        }
    
        const card = await Card.findById(id)
        if(!card){
            const error = new Error('card not found')
            error.status = 404
            throw error
        }

        card.question = newQuestion || card.question
        card.answer = newAnswer || card.answer
        card.level = newLevel || card.level
        card.tag = newTag || card.tag
        card.deck = newDeck || card.deck
        card.hint = newHint || card.hint

        const updatedCard = await card.save()

    
        if(!updatedCard){
            const error = new Error('error while updating card')
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: "updated card successfully",
            updatedCard
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }  
}

const deleteCard = async (req, res) => {
    try {
        // take card id
        // authenticate user - middleware
        // check card exist
        // delete
    
        const {id} = req.params
    
        if(!id || !isValidObjectId(id)){
            const error = new Error('provide valid card id')
            error.status = 400
            throw error
        }
    
        const card = await Card.findByIdAndDelete(id)
        if(!card){
            const error = new Error('card not found')
            error.status = 404
            throw error
        }
    
        return res.status(200).json({
            message: "card deleted successfully",
            card
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const filterCard = async (req, res) => {
    try {
        // take filter field from params
        // take user id
        // fetch data
    
        const {level, tag, deck} = req.query

        if(!req.user || !req.user._id){
            const error = new Error('Unauthorized - User ID missing')
            error.status = 401
            throw error
        }
        const id = req.user._id
    
        const matchQuery = {
            user: new mongoose.Types.ObjectId(id),
        };

        if (level) matchQuery.level = parseInt(level); 
        if (tag) matchQuery.tag = tag;
        if (deck) matchQuery.deck = deck;

        const cards = await Card.aggregate([
            { $match: matchQuery },
            { $sort: { reviewDate: 1 } }
        ]);
        
        if(!cards){
            const error = new Error("error while fetching decks")
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            cards,
            message: "cards fetched successfully"
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const tags = async (req, res) => {
    // get user from middleware
    // get all tags
    try {
        if(!req.user || !req.user._id){
            const error = new Error("Unauthorized - User ID missing")
            error.status = 401
            throw error
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
                $project: {tag: "$_id"}
            }
        ])

        if(!allTag){
            const error = new Error("error while fetching tags")
            error.status = 500
            throw error
        }

        return res.status(200).json({
            message: "all tags fetched successfully",
            allTag
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const decks = async (req, res) => {
    try {
        // take user id
        // autheticate user - middleware
        // fetch all decks
    
        if(!req.user || !req.user._id){
            const error = new Error('Unauthorized - User ID missing')
            error.status = 401
            throw error
        }
        const id = req.user._id
    
        const allDecks = await Card.aggregate([
            {
                $match: {user: new mongoose.Types.ObjectId(id)}
            },
            {
                $group: {
                    _id: "$deck",
                    totalCards: {$sum: 1}
                }
            },
            {
                $project: {
                    deck: "$_id",
                    totalCards: 1,
                    _id: 0
                }
            },
            {
                $sort: {totalCards: -1}
            }
        ])
    
        if(allDecks.length === 0){
            const error = new Error("No deck found")
            error.status = 404
            throw error
        }
        
        if(!allDecks){
            const error = new Error("error while fetching decks")
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: "all decks fetched successfully",
            allDecks
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const deckCards = async (req, res) => {
    try {
        // take user id 
        // take deck name from params
        // fetch cards of that deck
    
        if(!req.user || !req.user._id){
            const error = new Error('Unauthorized - User ID missing')
            error.status = 401
            throw error
        }
        const id = req.user._id
        const {deck} = req.params
    
        if(!deck){
            const error = new Error('provide valid deck name')
            error.status = 400
            throw error
        }
    
        const cards = await Card.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(id),
                    deck: deck
                }
            },
            {
                $project: {
                    question: 1,
                    answer: 1,
                    level: 1,
                    tag: 1,
                    deck: 1,
                    hint: 1,
                    reviewDate: 1
                }
            },
            {
                $sort: {reviewDate: 1}
            }
        ])
    
        if(cards.length === 0){
            const error = new Error("No cards found")
            error.status = 404
            throw error
        }
    
        if(!cards){
            const error = new Error("error while fetching cards")
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: "deck cards fetched successfully",
            cards
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}

const deleteDeck = async (req, res) => {
    try {
        // deck name from params
        // authenticate - middleware
        // check if deck is empty
        // delete cards first
        // delete deck
        
        const {deck} = req.params
        const id = req.user._id
        if(!deck){
            const error = new Error("provide deck name")
            error.status = 404
            throw error
        }
    
        if(!req.user || !req.user._id){
            const error = new Error('Unauthorized - User ID missing')
            error.status = 401
            throw error
        }
    
        const deletedDeck = await Card.deleteMany({
            user: new mongoose.Types.ObjectId(id),
            deck
        })
    
        if(!deletedDeck){
            const error = new Error('error while deleting deck')
            error.status = 500
            throw error
        }
    
        return res.status(200).json({
            message: "deck successfully deleted",
            deletedDeck
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Server error'
        })
    }
}


export {
    createCard,
    getAllCards,
    pendingCards, 
    updateCard, 
    deleteCard,
    filterCard,
    tags,
    decks,
    deckCards,
    deleteDeck
}