//express
import 'express-async-errors'
import express from 'express'
//middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import notFoundMiddleware from './middleware/not-found.js'
//dotenv
import dotenv from 'dotenv'
//db
import connectDB from './db/connect.js'
//routes
import authRouter from './routes/authRouter.js'
import jobRouter from './routes/jobRouter.js'

dotenv.config()

const app = express()

app.use(express.json())

app.get('/', (req,res) => {
    res.send("welcome")
})

//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',jobRouter)

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