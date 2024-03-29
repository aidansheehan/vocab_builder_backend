import { NextFunction, Request, Response }          from 'express';
import { CardInput, CollectionInput }               from '../schemas/collection.schema';
import { createCard,
     createCollection,
    deleteCard, 
    deleteCollectionById, 
    findAllCollections, 
    findCollectionById, 
    updateCard, 
    updateCollectionById }                          from '../services/collection.service';
import { TypedRequest, TypedRequestQuery }          from './types/collection.controller.types';


/**
 * Create and save a new collection
 */
export const createCollectionHandler = async (
    req: Request<{}, {}, CollectionInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        
        const { user }  = res.locals;   //Destructure res.locals
        const { _id }   = user;         //Destructure user for id

        //Create a collection with the specified data
        const collection = await createCollection(req.body, _id);

        res.status(200).json({
            status: 'success',
            data: collection,
        });
    } catch (err: any) {

        //Duplicate (collection already exists) mongo code 11000
        if (err.code === 11000) {
            return res.status(409).json({
                status: 'fail',
                message: 'Collection already exists'
            });
        }
        next(err);
    }
};

/**
 * Retrieve all collections from the database.
 */
export const findAllCollectionsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { user }  = res.locals;   //Destructure res.locals
        const { _id }   = user;         //Destructure user for id

        //Get query if needed
        const title = req.query['title'] as string

        //Get collections TODO implement condition
        const collections = await findAllCollections(_id, title);
        
        res.status(200).json({
            status: 'success',
            data: collections
        });
    } catch (err: any) {
        next(err);
    }
}

/**
 * Find a single collection with an id
 */
export const findOneCollectionHandler = async (
    req: TypedRequestQuery<{ collectionId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { collectionId } = req.params; //Get collection id from request params

        //Retrieve collection
        const collection = await findCollectionById(collectionId);
            
        //Return collection to the user
        res.status(200).json({
            status: 'success',
            data: collection
        });

    } catch (err: any) {
        next(err);
    }
}

/**
 * Update a collection by the id in the request
 */
export const updateCollectionHandler = async (
    req: TypedRequest<{ collectionId: string }, CollectionInput>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { collectionId } = req.params;    //Get collectionId from request params

        //Update collection with new data
        await updateCollectionById(req.body, collectionId);

        //Retrieve updated collection from DB
        const newCollection = await findCollectionById(collectionId);

        res.status(200).json({
            status: 'success',
            data: newCollection
        });

    } catch (err: any) {
        next(err);
    }
}

/**
 * Delete a collection with the specified id in the request
 */
export const deleteCollectionHandler = async (
    req: TypedRequestQuery<{ collectionId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { collectionId } = req.params;    //Get collectionId from request params

        //Delete collection
        await deleteCollectionById(collectionId);

        //Return success and deleted collection ID
        res.status(200).json({
            status: 'success',
            _id: collectionId
        });

    } catch (err: any) {
        next(err);
    }
}

/**
 * Delete all of a users collections
 */
export const deleteAllCollectionsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { user }          = res.locals;       //Destructure res.locals
        const { _id: userId }   = user;             //Destructure user

        //Retrieve all user's collections
        const collections = await findAllCollections(userId);

        //Loop through user's collections
        collections.forEach(collection => {
            
            const { id } = collection;  //Get collection ID

            deleteCollectionById(id);   //Delete this collection
        });

        res.status(402).json({
            status: 'success',
        });

    } catch (err: any) {
        next(err);
    }
}

/**
 * Create a new card in a collection
 */
export const createCardHandler = async (
    req: TypedRequest<{ collectionId: string }, CardInput>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { collectionId } = req.params;    //Get collectionId from request params

        //Modify collection by adding new card
        const collection = await createCard(collectionId, req.body)

        //Return success and updated collection
        res.status(200).json({
            status: 'success',
            data: collection
        });

    }

    catch (err: any) {
        next(err);
    }

}

/**
 * Update a card in a collection
 */
export const updateCardHandler = async (
    req: TypedRequest<{collectionId: string, cardId: string}, CardInput>,
    res: Response,
    next: NextFunction
) => {

    try {

        const { collectionId }  = req.params;   //get collectionId from request params
        const { cardId }        = req.params;   //get cardId from request params

        //Update collection with updated card
        const newCollection = await updateCard(collectionId, cardId, req.body);

        //Return success and updated collection
        res.status(200).json({
            status: 'success',
            data: {
                collection: newCollection
            }
        });
        
    } catch (err: any) {
        next(err);
    }
}

/**
 * Delete a card from a collection
 */
export const deleteCardHandler = async (
    req: TypedRequestQuery<{collectionId: string, cardId: string}>,
    res: Response,
    next: NextFunction
) => {

    try {

        const { collectionId }  = req.params;   //Get collectionId from request params
        const { cardId }        = req.params;   //Get cardId from request params

        //Delete card and return modified collection object
        const newCollection = await deleteCard(collectionId, cardId);

        //Return success and updated collection
        res.status(200).json({
            status: 'success',
            data: {
                collection: newCollection
            }
        });

    } catch (err: any) {
        next(err);
    }
}