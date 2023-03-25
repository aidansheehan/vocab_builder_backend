import { object, array, string, TypeOf } from 'zod';

/**
 * Single card request validation schema
 */
export const cardSchema = object({
    body: object({
        lexi: string({ required_error: 'Lexi is required' }),
        textPrompt: string({ required_error: 'Prompt is required' })  //TODO rename textPrompt VBB-8
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