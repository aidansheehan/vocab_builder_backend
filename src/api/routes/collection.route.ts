import express                                  from 'express';
import { deserializeUser }                      from '../middleware/deserializeUser';
import { requireUser }                          from '../middleware/requireUser';
import { validate }                             from '../middleware/validate';
import { cardSchema, collectionInfoSchema }     from '../schemas/collection.schema';
import { checkCollection }                      from '../middleware/checkCollection';
import { createCardHandler, 
    createCollectionHandler, 
    deleteAllCollectionsHandler, 
    deleteCardHandler, 
    deleteCollectionHandler, 
    findAllCollectionsHandler, 
    findOneCollectionHandler, 
    updateCardHandler, 
    updateCollectionHandler }                   from '../controllers/collection.controller';

const router = express.Router();
router.use(deserializeUser, requireUser);

/**
 * @openapi
 * /collections:
 *   post:
 *     summary: Create a new collection.
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title for the new collection
 *                 example: Numbers
 *               description:
 *                 type: string
 *                 description: Description for the new collection
 *                 example: A collection about numbers.
 *     responses:
 *       '200':
 *         description: The collection was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   description: The user's ID
 *                   example: 6418b11cea1ee958832591e1
 *                 title:
 *                   type: string
 *                   description: The title of the created collection
 *                   example: Numbers
 *                 description:
 *                   type: string
 *                   description: A description of the collection
 *                   example: A collection about numbers.
 *                 cards:
 *                   type: array
 *                   description: Array of user cards - this will be empty on create new collection
 *                   example: []
 *       '400':
 *         description: Request body validation error.
 *       '401':
 *          description: Unauthorized (invalid token or user doesn't exist)
 *       '409':
 *         description: This collection already exists.
 *       '500':
 *         description: Internal server error.
 */
router.post('/', validate(collectionInfoSchema), createCollectionHandler);

/**
 * @openapi
 * /collections:
 *   get:
 *     summary: Retrieve all of a user's collections.
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user's collections.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The collection ID
 *                     example: 6418b35625139bec07239af9
 *                   user_id:
 *                     type: string
 *                     description: The user ID
 *                     example: 6418b11cea1ee958832591e1
 *                   title:
 *                     type: string
 *                     description: The title of the collection
 *                     example: Numbers
 *                   description:
 *                     type: string
 *                     description: A description of the collection
 *                     example: A collection about numbers
 *                   cards:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         lexi:
 *                           type: string
 *                           description: The lexical item to be memorized
 *                           example: Ek
 *                         textPrompt: 
 *                           type: string
 *                           description: Text prompt used to help the user remember their lexical item
 *                           example: One
 *                         id:
 *                           type: string
 *                           description: The id of the card
 *                           example: fd1c6dc2-db1e-4f32-b3b7-885c0c386cca
 *       '401':
 *         description: Unauthorized (invalid token or user doesn't exist)
 *       '500':
 *         description: Internal server error.
 */
router.get('/', findAllCollectionsHandler);

/**
 * @openapi
 * /collections/{collectionId}:
 *   get:
 *     summary: Retrieves a single collection by ID
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the collection to be retrieved
 *     responses:
 *       '200':
 *         description: Collection successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The collection ID
 *                   example: 6418b35625139bec07239af9
 *                 user_id:
 *                   type: string
 *                   description: The user ID
 *                   example: 6418b11cea1ee958832591e1
 *                 title:
 *                   type: string
 *                   description: The title of the collection
 *                   example: Numbers
 *                 description:
 *                   type: string
 *                   description: A description of the collection
 *                   example: A collection about numbers.
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lexi:
 *                         type: string
 *                         description: The lexical item to be memorized
 *                         example: Ek
 *                       textPrompt: 
 *                         type: string
 *                         description: Text prompt used to help the user remember their lexical item
 *                         example: One
 *                       id:
 *                         type: string
 *                         description: The id of the card
 *                         example: fd1c6dc2-db1e-4f32-b3b7-885c0c386cca
 *       '401':
 *         description: Invalid token or user doesn't exist.
 *       '403':
 *         description: This user is not authorized to access the collection with specified ID.
 *       '404':
 *         description: No collection with specified ID was found.
 *       '500':
 *         description: Internal server error.
 *     
 */
router.get('/:collectionId', checkCollection, findOneCollectionHandler);

/**
 * @openapi
 * /collections/{collectionId}:
 *   put:
 *     summary: Update collection info
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the collection to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the collection
 *                 example: Numbers Edited
 *               description:
 *                 type: string
 *                 description: Description of the collection
 *                 example: An edited collection about numbers
 *     responses:
 *       '200':
 *         description: Collection successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The collection ID
 *                   example: 6418b35625139bec07239af9
 *                 user_id:
 *                   type: string
 *                   description: The user ID
 *                   example: 6418b11cea1ee958832591e1
 *                 title:
 *                   type: string
 *                   description: The title of the collection
 *                   example: Numbers Edited
 *                 description:
 *                   type: string
 *                   description: A description of the collection
 *                   example: An edited collection about numbers.
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lexi:
 *                         type: string
 *                         description: The lexical item to be memorized
 *                         example: Ek
 *                       textPrompt: 
 *                         type: string
 *                         description: Text prompt used to help the user remember their lexical item
 *                         example: One
 *                       id:
 *                         type: string
 *                         description: The id of the card
 *                         example: fd1c6dc2-db1e-4f32-b3b7-885c0c386cca
 *       '401':
 *         description: Invalid token or user doesn't exist.
 *       '403':
 *         description: This user is not authorized to access the collection with specified ID.
 *       '404':
 *         description: No collection with specified ID was found.
 *       '500':
 *         description: Internal server error.
 */
router.put('/:collectionId', checkCollection, validate(collectionInfoSchema), updateCollectionHandler);

/**
 * @openapi
 * /collections/{collectionId}:
 *   delete:
 *     summary: Delete a collection by ID
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the collection to be deleted.
 *     responses:
 *       '200':
 *         description: Collection successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the collection that was deleted
 *                   example: 6418b35625139bec07239af9
 *       '401':
 *         description: Invalid token or user doesn't exist.
 *       '403':
 *         description: This user is not authorized to access the collection with specified ID.
 *       '404':
 *         description: No collection with specified ID was found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:collectionId', checkCollection, deleteCollectionHandler);

//Delete all user's collections TBD
// router.delete('/', deleteAllCollectionsHandler);

/**
 * @openapi
 * /collections/{collectionId}/cards:
 *   post:
 *     summary: Create a new card in a collection
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the collection to create a new card in.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lexi:
 *                 type: string
 *                 description: The lexical item to be memorized.
 *               textPrompt:
 *                 type: string
 *                 description: A textPrompt to help the user remember the lexical item.
 *     responses:
 *       '200':
 *         description: Request to create a new card in collection successful. Returns the whole updated collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The collection ID
 *                   example: 6418b35625139bec07239af9
 *                 user_id:
 *                   type: string
 *                   description: The user ID
 *                   example: 6418b11cea1ee958832591e1
 *                 title:
 *                   type: string
 *                   description: The title of the collection
 *                   example: Numbers
 *                 description:
 *                   type: string
 *                   description: A description of the collection
 *                   example: A collection about numbers.
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lexi:
 *                         type: string
 *                         description: The lexical item to be memorized
 *                         example: Ek
 *                       textPrompt: 
 *                         type: string
 *                         description: Text prompt used to help the user remember their lexical item
 *                         example: One
 *                       id:
 *                         type: string
 *                         description: The id of the card
 *                         example: fd1c6dc2-db1e-4f32-b3b7-885c0c386cca
 *       '401':
 *         description: Authorization error - invalid token or user doesn't exist.
 *       '403':
 *         description: This collection belongs to someone else.
 *       '404':
 *         description: This collection does not exist or couldn't be found.
 *       '500':
 *         description: Internal server error.
 */
router.post('/:collectionId/cards', checkCollection, validate(cardSchema), createCardHandler);

/**
 * @openapi
 * /collections/{collectionId}/cards/{cardId}:
 *   put:
 *     summary: Update a card in a collection
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the collection to update a card in
 *       - in: path
 *         name: cardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the card to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lexi:
 *                 type: string
 *                 description: The lexical item to be memorized.
 *                 example: Do
 *               textPrompt:
 *                 type: string
 *                 description: A textPrompt to help the user remember the lexical item.
 *                 example: Two
 *     responses:
 *       '200':
 *         description: Request to update card successful. Returns the whole updated collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The collection ID
 *                   example: 6418b35625139bec07239af9
 *                 user_id:
 *                   type: string
 *                   description: The user ID
 *                   example: 6418b11cea1ee958832591e1
 *                 title:
 *                   type: string
 *                   description: The title of the collection
 *                   example: Numbers
 *                 description:
 *                   type: string
 *                   description: A description of the collection
 *                   example: A collection about numbers.
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lexi:
 *                         type: string
 *                         description: The lexical item to be memorized
 *                         example: Do
 *                       textPrompt: 
 *                         type: string
 *                         description: Text prompt used to help the user remember their lexical item
 *                         example: Two
 *                       id:
 *                         type: string
 *                         description: The id of the card
 *                         example: fd1c6dc2-db1e-4f32-b3b7-885c0c386cca
 *       '401':
 *         description: Invalid token or the user doesn't exist.
 *       '403':
 *         description: This collection belongs to someone else.
 *       '404':
 *         description: This collection does not exist or couldn't be found.
 *       '500':
 *         description: Internal server error.
 */

router.put('/:collectionId/cards/:cardId', checkCollection, validate(cardSchema), updateCardHandler);

/**
 * @openapi
 * /collections/{collectionId}/cards/{cardId}:
 *   delete:
 *     summary: Delete a card from a collection. Returns the updated collection
 *     tags: ['collections']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the collection to delete a card from
 *       - in: path
 *         name: cardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the card to be deleted
 *     responses:
 *       '200':
 *         description: Card successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The collection ID
 *                   example: 6418b35625139bec07239af9
 *                 user_id:
 *                   type: string
 *                   description: The user ID
 *                   example: 6418b11cea1ee958832591e1
 *                 title:
 *                   type: string
 *                   description: The title of the collection
 *                   example: Numbers
 *                 description:
 *                   type: string
 *                   description: A description of the collection
 *                   example: A collection about numbers.
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lexi:
 *                         type: string
 *                         description: The lexical item to be memorized
 *                         example: Ek
 *                       textPrompt: 
 *                         type: string
 *                         description: Text prompt used to help the user remember their lexical item
 *                         example: One
 *                       id:
 *                         type: string
 *                         description: The id of the card
 *                         example: fd1c6dc2-db1e-4f32-b3b7-885c0c386cca
 *       '401':
 *         description: Invalid token or the user doesn't exist.
 *       '403':
 *         description: This user is not authorized to access the specified collection.
 *       '404':
 *         description: A collection with this ID wasn't found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:collectionId/cards/:cardId', checkCollection, deleteCardHandler);

export default router;