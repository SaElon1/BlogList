const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    } else if (error.name === 'SyntaxError'){
        return response.status(400).json({error: error.message})
    }else if (error.name === 'JsonWebTokenError'){
        return response.status(400).json({ error: 'token missing or invalid'})
    }else if (error.name === 'TokenExpiredError'){
        return response.status(401).json({
            error : 'token expired'
        })
    }

    next(error)
}

module.exports = {
    requestLogger,errorHandler
}