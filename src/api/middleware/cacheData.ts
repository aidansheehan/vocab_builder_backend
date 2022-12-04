import { NextFunction, Request, Response }  from "express"
import { TypedRequestQuery }                from "../controllers/types/collection.controller.types"
import redisClient                          from "../helpers/connectRedis"
import { CollectionInput } from "../schemas/collection.schema";

/**
 * Middleware responsible for caching data in Redis
 * TODO atm this only applies to getCollectionById, either generalize logic or rename and write specific handlers
 */
export const cacheData = async (
    req: TypedRequestQuery< {id: string} >,
    res: Response,
    next: NextFunction
) => {

    /** TODO should this be in try block if cacheResults? Or is there a way to share with controller? */
    const { user }              = res.locals;   //Get user object
    const { _id: userId }       = user;         //Destructure user for id
    const { id: collectionId }  = req.params;   //Get collection ID from request parameters

    let results;    //Init results
    
    try {

        const cacheResults = await redisClient.get(collectionId);   //Attempt to retrieve data from redis

        //If data cached (found in Redis)
        if (cacheResults) {

            results = JSON.parse(cacheResults); //Parse results from Redis

            //User doesn't own this collection
            if (results.user_id !== userId.toString()) {

                //Return error
                res.status(401).json({
                    status: 'failed',
                    data: {
                        error: 'This user is not authorized to access this collection'
                    }
                })
            }

            //User owns this collection
            else {

                //Return data to the user
                res.status(202).json({
                    status: 'success',
                    data: {
                        fromCache: true,
                        data: results
                    }
                });
            }

        } 
        
        //If not cached proceed to controller to retrieve from mongo DB
        else {
            next();
        }
    } catch (err: any) {
        next(err);
    }

}

/**
 * Middleware responsible for caching data as it's input
 * **** TODO: THIS SHOULD NEVER HAPPEN AS WON'T BE IN DB YET OR HAVE AN ID. 
 * **** SET IN REDIS ON RETURN SUCCESS FROM DB CREATE()
 */

/**
 * Middleware responsible for deleting data in redis before passing to controller for DB delete
 */
export const deleteCacheData = async (
    req: TypedRequestQuery<{ id: string }>,
    res: Response,
    next: NextFunction
) => {

    const { user }          = res.locals;   //Destructure res.locals
    const { _id: userId }   = user;         //Destructure user

    const { id: collectionId } = req.params;    //Get collectionId from request params

    try {

        //Attempt to retrieve data from redis
        const cacheResults = await redisClient.get(collectionId);

        //If data cached (found in Redis)
        if (cacheResults) {

            const results = JSON.parse(cacheResults);   //Parse results from Redis

            //User doesn't own this collection
            if (results.user_id !== userId.toString()) {

                //Return error
                res.status(401).json({
                    status: 'failed',
                    data: {
                        error: 'This user is not authorized to access this collection'
                    }
                })
            }

            //User owns this collection
            else {

                //Delete the data from cache memory TODO this is not working
                await redisClient.del(collectionId);

                //Proceed to controller to delete from mongo DB
                next();
            }
        }

        //If not cached proceed to controller to delete from mongo DB
        else {
            next();
        }
    } catch(err: any) {
        next(err);
    }
}