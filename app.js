const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const logger = require('./utils/logger')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
logger.info('connecting to:', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(() => {
    logger.info('connected succesfully to MongoDB')
})
.catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
})

app.use(cors())
app.use(express.json())

app.use(middleware.errorHandler)
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)

module.exports = app