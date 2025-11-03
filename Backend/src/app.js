import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true    
}))

// routes
import flashcardRouter from "./routes/flashcard.js"
import userRouter from './routes/User.js'

app.use("/api", flashcardRouter)
app.use("/api", userRouter)


export default app