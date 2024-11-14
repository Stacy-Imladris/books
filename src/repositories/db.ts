import {MongoClient} from 'mongodb';
import {BookViewModel} from '../models/books/BookViewModel';
import * as dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/books-stg'

const client = new MongoClient(mongoUri)

const db = client.db()

export const booksCollection = db.collection<BookViewModel>('books');

export async function runDB() {
    try {
        await client.connect()
        await client.db('books').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Connection to mongo server failed')
        await client.close()
    }
}

export const exclusionMongoId = {projection: {_id: 0}}
