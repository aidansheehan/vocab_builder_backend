import collectionModel, { Card, CollectionInfo }                from "../models/collection.model";
import { uuid }                                                 from "uuidv4";
import { standardizeTextInput, titleCase, sentenceCase }        from "../helpers/formatText";

/**
 * Collection service for communicating with the database
 */

// createCollection service
export const createCollection = async (data: CollectionInfo, user_id: string) => {

    const fTitle        = titleCase(data.title);            //Format title
    const fDescription  = sentenceCase(data.description);   //Format description

    //Construct formatted collection data with ID
    const dataWithId = { title: fTitle, description: fDescription, "user_id": user_id }

    const collection = await collectionModel.create(dataWithId);
    return collection.toJSON();
}

// find collections by user ID and optionally with search query on title
export const findAllCollections = async(user_id: string, title?: string) => {

    //Condition to search if given
    const condition = title ? { title: { $regex: new RegExp(title), $options: "i" }} : {};

    return await collectionModel.find({ "user_id": user_id, ...condition });
}

// find one collection by it's ID
export const findCollectionById = async (id: string) => {
    return await collectionModel.findById(id);
}

// Update a collection by it's ID
export const updateCollectionById = async (data: CollectionInfo, id: string) => {

    const fTitle        = titleCase(data.title);            //Format title
    const fDescription  = sentenceCase(data.description);   //Format description

    //Construct formatted data object
    const fData = { title: fTitle, description: fDescription };

    //TODO investigate prob need options here to prevent overwrite of collection id, may be other probs like wrong type
    return await collectionModel.findByIdAndUpdate(id, fData);

}

// Delete a collection by it's ID
export const deleteCollectionById = async (id: string) => {
    return await collectionModel.findByIdAndDelete(id);
}

// Service to add a new card to a collections cards array by collection ID
export const createCard = async (collectionId: string, data: Card) => {

    //Find the collection by its ID
    const collection = await collectionModel.findById(collectionId);

    //Check if the collection exists TODO remove or standardize VBB-8
    if (!collection) {
        throw new Error(`Collection with ID ${collectionId} not found.`);
    }

    const fLexi         = standardizeTextInput(data.lexi);          //Format lexi to lower case with no trailing whitespace
    const fTextPrompt   = standardizeTextInput(data.textPrompt);    //Format textPrompt to lower case with no trailing whitespace

    //Give the card an ID
    const cardWithId = { lexi: fLexi, textPrompt: fTextPrompt, "id": uuid() };

    //Add the card to the collection's array of cards
    collection.cards.push(cardWithId);

    //Save the collection to the database
    await collection.save();

    //Return the modified collection
    return collection;
}

//Service to update an existing card in a collection
export const updateCard = async (collectionId: string, cardId: string, data: Card) => {

    //Find the collection by its ID TODO remove this logic or always do this check here VBB-8
    const collection = await collectionModel.findById(collectionId);

    //Check if the collection exists TODO remove or standardize VBB-8
    if (!collection) {
        throw new Error(`Collection with ID ${collectionId} not found.`);
    }

    const fLexi         = standardizeTextInput(data.lexi);      //Format lexi to lower case with no trailing whitespace
    const fTextPrompt   = standardizeTextInput(data.textPrompt);    //Format textPrompt to lower case with no trailing whitespace

    //Construct card with ID
    const cardWithId = { lexi: fLexi, textPrompt: fTextPrompt, id: cardId }

    //Find the card TODO should refactor by indexing array VBB-8
    const newCards = collection.cards.map(c_ => {

        //If card id matches
        if (c_.id == cardId) {

            //Replace card with new data
            return cardWithId
        }

        //If card id doesn't match
        else {

            //Return card as it was
            return c_
        }
    })

    //Replace old cards array with new cards array
    collection.cards = newCards;

    //Save the modified collection to the database
    await collection.save();

    //Return the modified collection
    return collection;

}

//Service to delete a single card from a collection
export const deleteCard = async (collectionId: string, cardId: string) => {

    //Find the collection by its ID
    const collection = await collectionModel.findById(collectionId);

    //Check if the collection exists
    if (!collection) {
        throw new Error(`Collection with ID ${collectionId} not found.`);
    }

    //Filter array for card with specified id
    const newCards = collection.cards.filter(c_ => {
        return c_.id !== cardId
    })

    //Replace old cards array with array with card with specified id removed
    collection.cards = newCards;

    //Save the modified collection to the database
    await collection.save();

    //Return the modified collection
    return collection;
}