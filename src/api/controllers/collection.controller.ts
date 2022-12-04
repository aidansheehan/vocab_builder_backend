import { NextFunction, Request, Response }                                                                      from "express";
import redisClient                                                                                              from "../helpers/connectRedis";
import { CollectionInput }                                                                                      from "../schemas/collection.schema";
import { createCollection, deleteCollectionById, findAllCollections, findCollectionById, updateCollectionById } from "../services/collection.service";
import { TypedRequest, TypedRequestQuery }                                                                      from "./types/collection.controller.types";


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
    req: TypedRequestQuery<{ id: string }>,
    res: Response,
    next: NextFunction
) => {

    let results; //Init results

    const { user }              = res.locals;   //Get user
    const { _id: userId }       = user;         //Destructure user for id
    const { id: collectionId }  = req.params    //Get collection ID from request params

    try {

        results = await findCollectionById(collectionId); //Retrieve data from mongo

        //If collection exists
        if (results) {

            //user doesn't own this collection
            if (results?.user_id !== userId.toString()) {

                //Return error
                res.status(401).json({
                    status: 'failed',
                    data: {
                        error: 'This user is not authorized to access this collection'
                    }
                });
            }
        
            //user owns this collection
            else {

                //Cache data in redis
                await redisClient.set(collectionId, JSON.stringify(results), {
                    EX: 180,
                    NX: true
                });

                //Return data to the user
                res.status(202).json({
                    status: 'success',
                    data: {
                        fromCache: false,
                        data: results
                    }
                })
            }

        }

        //Collection doesn't exist
        else {

            //Return not found error
            res.status(404).json({
                status: 'failed',
                data: {
                    error: 'This collection wasn\'t found'
                }
            })
        }

    } catch (err: any) {
        next(err);
    }
}

/**
 * Update a collection by the id in the request
 */
export const updateCollectionHandler = async (
    req: TypedRequest<{ id: string }, CollectionInput>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { user }          = res.locals;   //Destructure res.locals
        const { _id: userId }   = user;         //Destructure user

        const { id: collectionId } = req.params;    //Get collectionId from request params

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

            res.status(202).json({
                status: 'success'
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
    req: TypedRequestQuery<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {

        const { user }          = res.locals;   //Destructure res.locals
        const { _id: userId }   = user;         //Destructure user

        const { id: collectionId } = req.params;    //Get collectionId from request params

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
                status: 'success'
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