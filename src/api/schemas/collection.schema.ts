import { object,/* array,*/ string, TypeOf } from 'zod';

/**
 * createCollection validation schema TODO - if can be generic should call generic name collectionSchema maybe
 */
export const createCollectionSchema = object({
    body: object({
        title: string({ required_error: 'Title is required' }),
        description: string({ required_error: 'Description is required' }),

        // //TBD
        // cards: array({

        // })
    })
})

/**
 * findCollectionById validation schema
 */
// export const findCollectionByIdSchema = object({

// })

/**
 * createCard validation schema
 */

export type CreateCollectionInput = TypeOf<typeof createCollectionSchema>['body'];