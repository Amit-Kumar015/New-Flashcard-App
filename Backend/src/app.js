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
import cardRouter from "./routes/card.route.js"
import userRouter from './routes/user.route.js'

app.use("/api", cardRouter)
app.use("/api", userRouter)


export default app