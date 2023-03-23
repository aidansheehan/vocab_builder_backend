import { NextFunction, Request, Response } from "express";
import { findCollectionById } from "../services/collection.service";

/**
 * Middleware to check if collection doesn't exist or doesn't belong to current user and return appropraite errors if so
 */
export const checkCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { user }          = res.locals;       //Destructure res.locals
        const { _id: userId }   = user;             //Destructure user
        const { collectionId }  = req.params;       //Get collectionId from request params

        //Retrieve collection
        const collection = await findCollectionById(collectionId);

        //If collection not found
        if (!collection) {

            //Return error
            return res.status(404).json({
                status: 'fail',
                message: 'A collection with this ID wasn\'t found'
            });
        }

        //If user doesn't own collection
        if (collection.user_id !== userId.toString()) {

            //Return authorization error
            return res.status(403).json({
                status: 'failed',
                message: 'This user is not authorized to access this collection'
            });
        }

        next();
    } catch (err: any) {
        next(err);
    }
}