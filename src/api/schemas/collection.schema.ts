import { object, array, string, TypeOf } from 'zod';

/**
 * Single card validation schema
 */
export const CardType = object({
        lexi: string({ required_error: 'Lexi is required' }),
        description: string({ required_error: 'Description is required' })  //TODO rename prompt VBB-8
})

/**
 * Single card request validation schema
 */
export const cardSchema = object({
    body: object({
        lexi: string({ required_error: 'Lexi is required' }),
        description: string({ required_error: 'Description is required' })  //TODO rename prompt VBB-8
    })
})

/**
 * Collection validation schema
 */
export const collectionSchema = object({
    body: object({
        title: string({ required_error: 'Title is required' }),
        description: string({ required_error: 'Description is required' }),
        cards: array(CardType)
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
export type CardInput       = TypeOf<typeof cardSchema>['body'];