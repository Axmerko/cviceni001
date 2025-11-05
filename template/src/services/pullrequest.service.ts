import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import PullRequest from '../database/models/pullrequest.model';
import { PullRequestDto } from '../types/dto/pullrequest.dto';
import { ApiError } from '../types/api.error';

export const pullRequestService = {
    pullRequests_collection: mongo.db.collection("pullRequests"),
    developers_collection: mongo.db.collection("developers"),

    async getAll() {
        //TODO
    },

    async getById(id: string) {
        //TODO
    },

    async create(data: PullRequestDto) {
        //TODO
    },

    async update(id: string, data: PullRequestDto) {
        //TODO
    },

    async delete(id: string) {
        //TODO
    },

    async search(query: string) {
        //TODO
    }
}
