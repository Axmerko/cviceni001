import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import PullRequest from '../database/models/pullrequest.model';
import { PullRequestDto } from '../types/dto/pullrequest.dto';
import { ApiError } from '../types/api.error';
import Developer from '../database/models/developer.model';

export const pullRequestService = {
    pullRequests_collection: mongo.db!.collection<PullRequest>("pullRequests"),
    developers_collection: mongo.db!.collection<Developer>("developers"),

    async getAll() {
        return await this.pullRequests_collection.find().toArray();
    },

    async getById(id: string) {
        const pullRequest = await this.pullRequests_collection.findOne({ _id: new ObjectId(id) });
        if (!pullRequest) {
            throw new ApiError('not found', 'Pull request not found', 404);
        }
        return pullRequest;
    },

    async create(data: PullRequestDto) {

        const author = await this.developers_collection.findOne({ _id: new ObjectId(data.authorId) });
        if (!author) {
            throw new ApiError('not found', 'Author not found', 404);
        }

        const newPullRequest = new PullRequest(
            data.title,
            data.description,
            new ObjectId(data.authorId),
            data.sourceBranch,
            data.targetBranch,
            data.status,
            [], 0, 0, new Date()
        );

        const result = await this.pullRequests_collection.insertOne(newPullRequest);
        return { ...newPullRequest, _id: result.insertedId };
    },

    async update(id: string, data: PullRequestDto) {

        const author = await this.developers_collection.findOne({ _id: new ObjectId(data.authorId) });
        if (!author) {
            throw new ApiError('not found', 'Author not found', 404);
        }

        const updateData = {
            title: data.title,
            description: data.description,
            authorId: new ObjectId(data.authorId),
            sourceBranch: data.sourceBranch,
            targetBranch: data.targetBranch,
            status: data.status,
        };

        const result = await this.pullRequests_collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' } // Vrátí aktualizovaný dokument
        );

        if (!result) {
            throw new ApiError('not found', 'Pull request not found', 404);
        }
        return result;
    },

    async delete(id: string) {
        const result = await this.pullRequests_collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {

            throw new ApiError('not found', 'Pull request not found', 404);
        }

    },

    async search(query: string) {

        const regex = new RegExp(query, 'i');


        const results = await this.pullRequests_collection.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { sourceBranch: { $regex: regex } }
            ]
        }).toArray();

        return results;
    }
}