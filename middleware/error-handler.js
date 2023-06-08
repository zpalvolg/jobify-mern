import {StatusCodes} from 'http-status-codes'

const errorHandlerMiddleware = (err,req,res,next) => {
    console.log(err)

    const defaultError = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
        ,msg: 'Something went wrong, try again later.'
    }

    //DB errors: checking requiered fields and validation like correct email address
    if (err.name === 'ValidationError'){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = err.message
    }

    //DB errors: checking unique fileds
    if(err.code && err.code === 11000){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
    }


    res.status(defaultError.statusCode).json({
        msg: defaultError.msg //err
    })
}

export default errorHandlerMiddleware