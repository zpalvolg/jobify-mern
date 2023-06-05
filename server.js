import express from 'express'

const app = express()

//middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import notFoundMiddleware from './middleware/not-found.js'

app.get('/', (req,res) => {
    res.send("welcome")
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})