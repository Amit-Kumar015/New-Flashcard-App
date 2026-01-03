import {Router} from "express"
import { verifyJWT } from "../middleware/authMiddleware.js"
import { decks,
        deckCards,
        deleteDeck,
        searchDeck,
        addPublicDeckToUser 
} from "../controllers/deck.controller.js"

const router = Router()

router.route("/flashcard/decks")
        .get(verifyJWT, decks)

router.route("/flashcard/decks/:deckId")
        .get(verifyJWT, deckCards)
        .delete(verifyJWT, deleteDeck)

router.route("/flashcard/decks/action/search")
        .get(verifyJWT, searchDeck)

router.route("/flashcard/decks/action/add/:deckId")
        .patch(verifyJWT, addPublicDeckToUser)
        
   
export default router