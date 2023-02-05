import { object, array, string, TypeOf } from 'zod';

/**
 * Single card validation schema
 */
export const cardSchema = object({
    lexi: string({ required_error: 'Lexi is required' }),
    description: string({ required_error: 'Description is required' })  //TODO rename prompt VBB-8
})

/**
 * Collection validation schema
 */
export const collectionSchema = object({
    body: object({
        title: string({ required_error: 'Title is required' }),
        description: string({ required_error: 'Description is required' }),
        cards: array(cardSchema)
    })
})

/**
 * Collection info validation schema
 */
export const collectionInfoSchema = object({
    body: object({
        title: string({ required_error: 'Title is required' }),
        description: string({ required_error: 'Description is required' })
    })
})


export type CollectionInput = TypeOf<typeof collectionInfoSchema>['body'];