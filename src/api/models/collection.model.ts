import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

//Export the card class to be used as Typescript type
export class Card {
    @prop({required: true})
    lexi: string;

    @prop({required: true})
    prompt: string;
}

//Export the card with generated ID class to be used as Typescript type
export class CardWithId {
    @prop({required: true})
    lexi: string;

    @prop({required: true})
    prompt: string;

    @prop({required: true})
    id: string
}

//Export the collection class to be used as Typescript type
export class Collection {
    @prop()
    user_id: string;

    @prop()
    title: string;

    @prop()
    description: string;

    @prop()
    cards: Array<CardWithId>;

}

//Create the colection model from the Collection class
const collectionModel = getModelForClass(Collection);

export default collectionModel