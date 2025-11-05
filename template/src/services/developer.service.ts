import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import Developer from '../database/models/developer.model';
import { DeveloperDto } from '../types/dto/developer.dto';

export const developerService = {
    developers_collection: mongo.db.collection("developers"),

    async create(data: DeveloperDto) {
        //TODO
    },

}
