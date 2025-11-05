import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import Developer from '../database/models/developer.model';
import { DeveloperDto } from '../types/dto/developer.dto';

export const developerService = {
    developers_collection: mongo.db!.collection<Developer>("developers"),

    async create(data: DeveloperDto) {

        const newDeveloper = new Developer(
            data.name,
            data.email,
            data.username,
            [],
            []
        );


        const result = await this.developers_collection.insertOne(newDeveloper);


        return { ...newDeveloper, _id: result.insertedId };
    },

}