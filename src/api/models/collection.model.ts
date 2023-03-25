import { getModelForClass, prop } from '@typegoose/typegoose';

//Export the card class to be used as Typescript type
export class Card {
    @prop({required: true})
    lexi: string;

    @prop({required: true})
    textPrompt: string;
}

//Export the card with generated ID class to be used as Typescript type
export class CardWithId {
    @prop({required: true})
    lexi: string;

    @prop({required: true})
    textPrompt: string;

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

//Export the collection info class to be used as a typescript type
export class CollectionInfo {
    @prop()
    title: string;

    @prop()
    description: string;
}

//Create the colection model from the Collection class
const collectionModel = getModelForClass(Collection);

export default collectionModel