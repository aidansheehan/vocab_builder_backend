import express                          from 'express';
import { deserializeUser }              from '../middleware/deserializeUser';
import { requireUser }                  from '../middleware/requireUser';
import { validate }                     from '../middleware/validate';
import { collectionInfoSchema }             from '../schemas/collection.schema';
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

//Create a New Collection (info)
router.post('/', validate(collectionInfoSchema), createCollectionHandler);

//Retrieve All Collections
router.get('/', findAllCollectionsHandler);

//Retrieve a Single Collection with Id
router.get('/:id', findOneCollectionHandler);

//Update a Collection (info) with Id
router.put('/:id', validate(collectionInfoSchema), updateCollectionHandler);

//Delete a collection with Id
router.delete('/:id', deleteCollectionHandler);

//Delete all user's collections
router.delete('/', deleteAllCollectionsHandler);

// //Create a new card in a collection
// router.post('/:collectionId/cards', validate(cardSchema),  )

export default router;