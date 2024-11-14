import {createFieldChain} from './utils';

export const bookTitleValidator = createFieldChain('title', 70)

export const bookDescriptionValidator = createFieldChain('description', 500)
