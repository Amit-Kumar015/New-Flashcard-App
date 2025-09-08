import {Router} from "express"
import { verifyJWT } from "../middleware/authMiddleware.js"
import { createCard, 
        getAllCards, 
        pendingCards, 
        updateCard, 
        deleteCard, 
        filterCard, 
        tags,
        decks, 
        deckCards, 
        deleteDeck 
        // make a controller to fetch single card
} from "../controllers/flashcard.js"

const router = Router()

router.route("/flashcard")
        .get(verifyJWT, getAllCards)
        .post(verifyJWT, createCard)

router.route("/flashcard/tag")
        .get(verifyJWT, tags)

router.route("/flashcard/pending")
        .get(verifyJWT, pendingCards)

router.route("/flashcard/:id")
        .patch(verifyJWT, updateCard)
        .delete(verifyJWT, deleteCard)

router.route("/flashcard/filter")
        .get(verifyJWT, filterCard)

router.route("/flashcard/decks")
        .get(verifyJWT, decks)

router.route("/flashcard/decks/:deck")
        .get(verifyJWT, deckCards)
        .delete(verifyJWT, deleteDeck)
        
   
export default router