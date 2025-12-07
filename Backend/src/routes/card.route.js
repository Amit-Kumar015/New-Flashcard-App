import {Router} from "express"
import { verifyJWT } from "../middleware/authMiddleware.js"
import { createCard, 
        getAllCards, 
        pendingCards, 
        updateCard, 
        deleteCard, 
        filterCard, 
        tags,
        updateReviewDate
} from "../controllers/card.controller.js"

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

router.route("/flashcard/actions/review")
        .patch(verifyJWT, updateReviewDate)
        
   
export default router