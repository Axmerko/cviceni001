import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import Review, { ReviewComment } from '../database/models/review.model';
import { ReviewDto } from '../types/dto/review.dto';
import { ApiError } from '../types/api.error';
import PullRequest from '../database/models/pullrequest.model';
import Developer from '../database/models/developer.model';

export const reviewService = {
    reviews_collection: mongo.db!.collection<Review>("reviews"),
    pullRequests_collection: mongo.db!.collection<PullRequest>("pullRequests"),
    developers_collection: mongo.db!.collection<Developer>("developers"),

    async create(data: ReviewDto) {
        const pullRequestId = new ObjectId(data.pullRequestId);
        const reviewerId = new ObjectId(data.reviewerId);


        const pullRequest = await this.pullRequests_collection.findOne({ _id: pullRequestId });
        if (!pullRequest) {
            throw new ApiError('not found', 'Pull request not found', 404);
        }


        const reviewer = await this.developers_collection.findOne({ _id: reviewerId });
        if (!reviewer) {
            throw new ApiError('not found', 'Reviewer not found', 404);
        }


        if (pullRequest.authorId.toString() === data.reviewerId) {
            throw new ApiError('forbidden', 'Cannot review your own pull request', 403);
        }


        if (pullRequest.status === 'merged' || pullRequest.status === 'closed') {
            throw new ApiError('conflict', 'Cannot review a closed or merged pull request', 409);
        }


        const newReview = new Review(
            pullRequestId,
            reviewerId,
            data.decision as 'approve' | 'request_changes' | 'comment',
            data.comments,
            new Date()
        );

        const insertResult = await this.reviews_collection.insertOne(newReview);
        const insertedId = insertResult.insertedId;


        const updatePrOps: any = {
            $push: { reviews: insertedId }
        };

        if (data.decision === 'approve') {
            updatePrOps.$inc = { approvalCount: 1 };
        } else if (data.decision === 'request_changes') {
            updatePrOps.$inc = { changesRequestedCount: 1 };
        }

        await this.pullRequests_collection.updateOne(
            { _id: pullRequestId },
            updatePrOps
        );


        await this.developers_collection.updateOne(
            { _id: reviewerId },
            { $push: { reviews: insertedId } }
        );


        return { ...newReview, _id: insertedId };
    },
}