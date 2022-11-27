import { object, array, string, TypeOf } from 'zod';

/**
 * Single card validation schema
 */
export const Card = object({
    lexi: string({ required_error: 'Lexi is required' }),
    description: string({ required_error: 'Description is required' })
})

/**
 * Collection validation schema
 */
export const collectionSchema = object({
    body: object({
        title: string({ required_error: 'Title is required' }),
        description: string({ required_error: 'Description is required' }),
        cards: array(Card)
    })
})


export type CollectionInput = TypeOf<typeof collectionSchema>['body'];