import express, {Response} from 'express';
import type {BookViewModel} from '../models/books/BookViewModel';
import type {CreateBookModel} from '../models/books/CreateBookModel';
import type {QueryBooksModel} from '../models/books/QueryBooksModel';
import type {UpdateBookModel} from '../models/books/UpdateBookModel';
import type {URIParamsBookIdModel} from '../models/books/URIParamsBookIdModel';
import type {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from '../types';
import {HTTP_STATUSES} from '../utils';
import {booksRepository} from '../repositories/books-repository';
import {inputValidationMiddleware} from '../middlewares/input-validation-middleware';
import {basicAuthMiddleware} from '../middlewares/basic-auth-middleware';
import {bookDescriptionValidator, bookTitleValidator} from '../validators/books-validators';

export const getBooksRouter = () => {
    const router = express.Router()

    router.get('/', async (req: RequestWithQuery<QueryBooksModel>, res: Response<BookViewModel[]>) => {
        const foundBooks = await booksRepository.findBooks(req.query.title?.toString())

        res.json(foundBooks)
    })

    router.get('/:id', async (req: RequestWithParams<URIParamsBookIdModel>,
                             res: Response<BookViewModel>) => {
        const foundBook = await booksRepository.findBookById(req.params.id)

        if (!foundBook) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(foundBook)
    })

    router.post('/', basicAuthMiddleware, bookTitleValidator, bookDescriptionValidator, inputValidationMiddleware, async (req: RequestWithBody<CreateBookModel>, res: Response<BookViewModel>) => {
        const {title, description} = req.body

        const newBook = await booksRepository.createBook(title, description)

        if (newBook) {
            res.status(HTTP_STATUSES.CREATED_201).json(newBook)
        }

        res.status(HTTP_STATUSES.BAD_REQUEST_400)
    })

    router.put('/:id', basicAuthMiddleware, bookTitleValidator, bookDescriptionValidator, inputValidationMiddleware, async (req: RequestWithParamsAndBody<URIParamsBookIdModel, UpdateBookModel>, res) => {
        const {title, description} = req.body

        const isUpdated = await booksRepository.updateBook(req.params.id, title, description)

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    router.delete('/:id', basicAuthMiddleware, async (req: RequestWithParams<URIParamsBookIdModel>, res) => {
        const isDeleted = await booksRepository.deleteBook(req.params.id)

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

    return router
}
