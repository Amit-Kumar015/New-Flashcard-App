import {Router} from "express"
import { verifyJWT } from "../middleware/authMiddleware.js"
import { decks, 
        deckCards, 
        deleteDeck 
} from "../controllers/deck.controller.js"

const router = Router()

router.route("/flashcard/decks")
        .get(verifyJWT, decks)

router.route("/flashcard/decks/:deck")
        .get(verifyJWT, deckCards)
        .delete(verifyJWT, deleteDeck)
        
   
export default router