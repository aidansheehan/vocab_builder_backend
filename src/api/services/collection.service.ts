import collectionModel, { Collection }  from "../models/collection.model"

/**
 * Collection service for communicating with the database
 */

// createCollection service
export const createCollection = async (data: Partial<Collection>, user_id: string) => {

    //TODO may need excluded fields here - what does FE need returned
    const dataWithId = { ...data, "user_id": user_id }

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
export const updateCollectionById = async (data: Partial<Collection>, id: string) => {

    //TODO investigate prob need options here to prevent overwrite of collection id, may be other probs like wrong type
    return await collectionModel.findByIdAndUpdate(id, data);

}

// Delete a collection by it's ID
export const deleteCollectionById = async (id: string) => {
    return await collectionModel.findByIdAndDelete(id);
}