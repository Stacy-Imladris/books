import express from 'express'
import bodyParser from 'body-parser'
import {getBooksRouter} from './routes/books';

export const app = express()

app.use(bodyParser.json())

app.use('/books', getBooksRouter())
