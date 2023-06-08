import {StatusCodes} from 'http-status-codes'

const errorHandlerMiddleware = (err,req,res,next) => {
    console.log(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: err
    })
}

export default errorHandlerMiddleware