import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import apiRouter from './routes/api'

dotenv.config()
const app = express()
const port = process.env.SERVER_PORT

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//   res.send('Hello Gramp!')
// })

app.use('/', apiRouter)

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log('Bitches be listenin')
})