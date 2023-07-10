//express
import 'express-async-errors'
import express from 'express'
//middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import notFoundMiddleware from './middleware/not-found.js'
import morgan from 'morgan'
import authenticateUser from './middleware/auth.js';
//dotenv
import dotenv from 'dotenv'
//db
import connectDB from './db/connect.js'
//routes
import authRouter from './routes/authRouter.js'
import jobRouter from './routes/jobRouter.js'
//deployment
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
//secure packages
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

dotenv.config()

const app = express()

if(process.env.NODE_ENV !== 'product'){
    app.use(morgan('dev'))
}

app.use(express.json())
//secure packages
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//deploy
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './client/jobify/build')));

//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs', authenticateUser, jobRouter)

//deploy (after routes, use this to cover other 'get' methods)
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/jobify/build', 'index.html'));
});

//middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL)

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })

    }catch(error){
        console.log(error)
    }
}

start()