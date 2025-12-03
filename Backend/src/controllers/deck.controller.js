import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../models/User.model.js"
import {Card} from "../models/Card.model.js"
import {Deck} from "../models/deck.model.js"
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js"
import catchAsync from "../utils/catchAsync.js";

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
    tags
}