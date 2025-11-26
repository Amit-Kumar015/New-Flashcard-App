import {Router} from "express"
import { signup, login } from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/authMiddleware.js"

const router = Router()

router.route("/signup").post(signup)

router.route("/login").post(login)

router.route("/verifyJWT").get(verifyJWT, (req, res) => {
    res.json({ message: "You accessed a protected route", user: req.user });
});

export default router