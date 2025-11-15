import express from "express"
import logger from "./utils/logger"
import config from "./utils/config"
import mongoose from "mongoose"
import middleware from "./utils/middleware"
import cookieParser from "cookie-parser"
import gamesRouter from "./controllers/games"
import ratingsRouter from "./controllers/ratings"
import usersRouter from "./controllers/users"
import commentsRouter from "./controllers/comments"
import favoriteRouter from "./controllers/favorite"
import loginRouter from "./controllers/login"
import path from "path"


const app = express()

mongoose.set("strictQuery", false)

if (config.MONGODB_URI) {
  const dbName = config.MONGODB_DBNAME
  const connectOptions = dbName ? { dbName } : undefined
  mongoose.connect(config.MONGODB_URI, connectOptions).catch((error) => {
    logger.error("error connecting to MongoDB:", error.message)
  })
}

app.use(express.static("dist"))
app.use(express.json())
app.use(cookieParser())
app.use(middleware.requestLogger)

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

app.use("/api/games", gamesRouter)
app.use("/api/ratings", ratingsRouter)
app.use("/api/users", usersRouter)
app.use("/api/comments", commentsRouter)
app.use("/api/favorite", favoriteRouter)
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app