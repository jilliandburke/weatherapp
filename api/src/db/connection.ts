import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

// tslint:disable-next-line:no-console
db.on('error', (error) => console.error(error))

export default db
