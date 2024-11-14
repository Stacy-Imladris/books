import type {BookViewModel} from '../models/books/BookViewModel';
import type {Nullable} from '../types';
import {booksCollection, exclusionMongoId} from './db';
import {v1} from 'uuid';

export const booksRepository = {
    async findBooks(searchNameTerm: string | undefined): Promise<BookViewModel[]> {
        const filter: any = {}

        if (searchNameTerm) {
            filter.title = {$regex: searchNameTerm}
        }

        return await booksCollection.find(filter, exclusionMongoId).toArray()
    },

    async findBookById(id: string): Promise<Nullable<BookViewModel>> {
        return await booksCollection.findOne({id}, exclusionMongoId)
    },

    async createBook(title: string, description: string): Promise<Nullable<BookViewModel>> {
        const newBook: BookViewModel = {
            id: v1(),
            title,
            description,
            createdAt: new Date().toISOString(),
        }

        const {insertedId} = await booksCollection.insertOne(newBook)

        return await booksCollection.findOne({_id: insertedId}, exclusionMongoId)
    },

    async updateBook(id: string, title: string, description: string): Promise<boolean> {
        const result = await booksCollection.updateOne({id}, {$set: {title, description}})

        return !!result.matchedCount
    },

    async deleteBook(id: string): Promise<boolean> {
        const result = await booksCollection.deleteOne({id})

        return !!result.deletedCount
    }
}
