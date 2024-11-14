import request from 'supertest';
import {app} from '../src/app';
import type {CreateBookModel} from '../src/models/books/CreateBookModel';
import type {UpdateBookModel} from '../src/models/books/UpdateBookModel';
import {HTTP_STATUSES} from '../src/utils';

const getRequest = () => request(app)

describe('/books', () => {
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await getRequest().get('/books')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing book', async () => {
        await getRequest().get('/books/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('shouldn\'t create book without authorization', async () => {
        const data: CreateBookModel = {
            title: 'Book title',
            description: 'Book description',
        }

        await getRequest().post('/books')
            .send(data)
            .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)

        await getRequest()
            .get('/books')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('shouldn\'t create book with incorrect name data', async () => {
        const data: CreateBookModel = {
            title: '',
            description: 'Book description',
        }

        await getRequest().post('/books')
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get('/books')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdBook1: any = null
    it('should create book with correct input data', async () => {
        const data: CreateBookModel = {
            title: 'Book title 1',
            description: 'Book description 1',
        }

        const createResponse = await getRequest()
            .post('/books')
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdBook1 = createResponse.body

        expect(createdBook1).toEqual({
            id: expect.any(String),
            title: data.title,
            description: data.description,
        })

        await getRequest()
            .get('/books')
            .expect(HTTP_STATUSES.OK_200, [createdBook1])
    })

    let createdBook2: any = null
    it('create one more book', async () => {
        const data: CreateBookModel = {
            title: 'Book title 2',
            description: 'Book description 2',
        }

        const createResponse = await getRequest()
            .post('/books')
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdBook2 = createResponse.body

        expect(createdBook2).toEqual({
            id: expect.any(String),
            title: data.title,
            description: data.description,
        })

        await getRequest()
            .get('/books')
            .expect(HTTP_STATUSES.OK_200, [createdBook1, createdBook2])
    })

    it('shouldn\'t update book with incorrect name data', async () => {
        const data: UpdateBookModel = {
            title: '',
            description: 'Book description',
        }

        await getRequest()
            .put(`/books/${createdBook1.id}`)
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get(`/books/${createdBook1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBook1)
    })

    it('shouldn\'t update book that not exist', async () => {
        const data: UpdateBookModel = {
            title: 'Book title',
            description: 'Book description',
        }

        await getRequest()
            .put(`/books/-999`)
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should update book with correct input data', async () => {
        const data: UpdateBookModel = {
            title: 'Correct title',
            description: 'Book description',
        }

        await getRequest()
            .put(`/books/${createdBook1.id}`)
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`/books/${createdBook1.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdBook1, ...data})

        await getRequest()
            .get(`/books/${createdBook2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBook2)
    })

    it('should delete both books', async () => {
        await getRequest()
            .delete(`/books/${createdBook1.id}`)
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`/books/${createdBook1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .delete(`/books/${createdBook2.id}`)
            .set('authorization', process.env.BASIC_AUTH_TOKEN!)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`/books/${createdBook2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .get(`/books`)
            .expect(HTTP_STATUSES.OK_200, [])
    })
})
