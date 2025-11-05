import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import Review, { ReviewComment } from '../database/models/review.model';
import { ReviewDto } from '../types/dto/review.dto';
import { ApiError } from '../types/api.error';

export const reviewService = {
    reviews_collection: mongo.db.collection("reviews"),
    pullRequests_collection: mongo.db.collection("pullRequests"),
    developers_collection: mongo.db.collection("developers"),

    async create(data: ReviewDto) {
        //TODO
    },

}
