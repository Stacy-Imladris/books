import {Request} from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, D> = Request<T, {}, D>

export type Nullable<T> = T | null

export type APIErrorResultType = {
    errorsMessages: FieldErrorType[]
}

export type FieldErrorType = {
    message: Nullable<string>
    field: Nullable<string>
}
