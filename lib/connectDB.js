import 'dotenv/config'
import mongoose from 'mongoose'
import { debug } from './debug.js'

mongoose.connection.on('error', error => debug('ERROR IN THE CONEXION WITH THE DATABASE', error))

export const connectDB = () => mongoose.connect(process.env.MONGO_URI).then(mongoose => mongoose.connection)
