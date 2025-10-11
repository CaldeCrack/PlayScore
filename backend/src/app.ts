import express, { NextFunction, Request, Response } from "express"
import logger from "./utils/logger"
import config from "./utils/config"
import mongoose from "mongoose"
import middleware from "./utils/middleware"
import cookieParser from "cookie-parser"


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

// app.use("/api/login", loginRouter)
// app.use("/api/notes", notesRouter)
// app.use("/api/users", usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app