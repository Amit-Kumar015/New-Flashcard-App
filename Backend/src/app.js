import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true    
}))

app.use(errorHandler)

// routes
import cardRouter from "./routes/card.route.js"
import userRouter from './routes/user.route.js'
import deckRouter from "./routes/deck.route.js"

app.use("/api", cardRouter)
app.use("/api", userRouter)
app.use("/api", deckRouter)

export default app