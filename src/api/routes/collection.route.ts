import express                          from 'express';
import { deserializeUser }              from '../middleware/deserializeUser';
import { requireUser }                  from '../middleware/requireUser';
import { validate }                     from '../middleware/validate';
import { collectionSchema }             from '../schemas/collection.schema';
import { cacheData, deleteCacheData }   from '../middleware/cacheData';
import { createCollectionHandler, 
    deleteAllCollectionsHandler, 
    deleteCollectionHandler, 
    findAllCollectionsHandler, 
    findOneCollectionHandler, 
    updateCollectionHandler }      from '../controllers/collection.controller';

/**
 * Routes to:
 *  - Create a collection
 */

const router = express.Router();
router.use(deserializeUser, requireUser);

//Create a New Collection
router.post('/', validate(collectionSchema), createCollectionHandler);

//Retrieve All Collections
router.get('/', findAllCollectionsHandler);

//Retrieve a Single Collection with Id
router.get('/:id', cacheData, findOneCollectionHandler);

//Update a Collection with Id
router.put('/:id', validate(collectionSchema), updateCollectionHandler);

//Delete a collection with Id
router.delete('/:id', deleteCacheData, deleteCollectionHandler);

//Delete all user's collections
router.delete('/', deleteAllCollectionsHandler);

export default router;