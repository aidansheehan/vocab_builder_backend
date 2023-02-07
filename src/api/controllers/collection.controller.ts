import { NextFunction, Request, Response }          from "express";
import { CardInput, CollectionInput }               from "../schemas/collection.schema";
import { createCard,
     createCollection,
    deleteCard, 
    deleteCollectionById, 
    findAllCollections, 
    findCollectionById, 
    updateCard, 
    updateCollectionById }                          from "../services/collection.service";
import { TypedRequest, TypedRequestQuery }          from "./types/collection.controller.types";


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

        res.status(202).json({
            status: 'success',
            data: {
                collection,
            },
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
        
        res.status(202).json({
            status: 'success',
            data: {
                collections
            }
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

        const { user }          = res.locals    //Destructure res.locals
        const { _id: userId }   = user;         //Destructure user

        const { collectionId } = req.params; //Get collection id from request params

        //Retrieve collection
        const collection = await findCollectionById(collectionId);

        //Check collection belongs to this user
        if (collection?.user_id !== userId.toString()) {

            //If user doesn't own collection return authorization error
            res.status(401).json({
                status: 'failed',
                data: {
                    error: 'This user is not authorized to access this collection'
                }
            });
        }

        //If collection belongs to this user
        else {
            
            //Return collection to the user
            res.status(202).json({
                status: 'success',
                data: {
                    collection
                }
            });
        }
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

        const { user }          = res.locals;   //Destructure res.locals
        const { _id: userId }   = user;         //Destructure user

        const { collectionId } = req.params;    //Get collectionId from request params

        //Retrieve collection
        const collection = await findCollectionById(collectionId);

        //Check collection belongs to this user
        if (collection?.user_id !== userId.toString()) {

            //If user doesn't own collection return authorization error
            res.status(401).json({
                status: 'failed',
                data: {
                    error: 'This user is not authorized to access this collection'
                }
            });
        }

        //If collection belongs to this user
        else {

            //Update collection with new data
            await updateCollectionById(req.body, collectionId);

            //Retrieve updated collection from DB TODO i'm not sure if this will always wait for DB to be updated?
            const newCollection = await findCollectionById(collectionId);

            res.status(202).json({
                status: 'success',
                data: newCollection
            });
        }
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

        const { user }          = res.locals;   //Destructure res.locals
        const { _id: userId }   = user;         //Destructure user

        const { collectionId } = req.params;    //Get collectionId from request params

        //Retrieve collection
        const collection = await findCollectionById(collectionId);

        //Check collection belongs to this user
        if (collection?.user_id !== userId.toString()) {

            //If user doesn't own collection return authorization error
            res.status(401).json({
                status: 'failed',
                data: {
                    error: 'This user is not authorized to access this collection'
                }
            });
        }

        //If collection belongs to this user
        else {

            //Delete collection
            await deleteCollectionById(collectionId);

            res.status(202).json({
                status: 'success',
                _id: collectionId
            });
        }
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

        //TODO VBB-8: need to check this collection belongs to current user
        // const { user }  = res.locals;   //Destructure res.locals
        // const { _id }   = user;         //Destructure user for id

        const { collectionId } = req.params;    //Get collectionId from request params

        //Modify collection by adding new card
        const collection = await createCard(collectionId, req.body)

        //Return success and updated collection
        res.status(202).json({
            status: 'success',
            data: {
                collection
            }
        })
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

        const { user }          = res.locals;   //Destructure res.locals
        const { _id: userId }   = user;         //Destructure user

        const { collectionId }  = req.params;   //get collectionId from request params
        const { cardId }        = req.params;   //get cardId from request params

        //Retrieve collection
        const collection = await findCollectionById(collectionId);

        //Check collection belongs to this user TODO what if collection doesn't exist VBB-8
        if (collection?.user_id !== userId.toString()) {

            //If user doesn't own collection return authorization error
            res.status(401).json({
                status: 'failed',
                data: {
                    error: 'This user is not authorized to access this collection'
                }
            })
        }

        //If collection belongs to this user
        else {

            //Update collection with updated card
            const newCollection = await updateCard(collectionId, cardId, req.body);

            //Return success and updated collection
            res.status(202).json({
                status: 'success',
                data: {
                    collection: newCollection
                }
            })

            
        }

        
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

        const { user }          = res.locals;   //Destructure res.locals
        const { _id: userId }   = user;         //Destructure user

        const { collectionId }  = req.params;   //Get collectionId from request params
        const { cardId }        = req.params;   //Get cardId from request params

        //Retrieve collection
        const collection = await findCollectionById(collectionId);

        //Check collection belongs to this user
        if (collection?.user_id !== userId.toString()) {

            //If user doesn't own collection return authorization error
            res.status(401).json({
                status: 'failed',
                data: {
                    error: 'This user is not authorized to access this collection'
                }
            });
        }

        //If collection belongs to this user
        else {

            //Delete card and return modified collection object
            const newCollection = await deleteCard(collectionId, cardId);

            //Return success and updated collection
            res.status(202).json({
                status: 'success',
                data: {
                    collection: newCollection
                }
            })
        }
    } catch (err: any) {
        next(err);
    }
}