import { ObjectId } from "mongodb";

export default class PullRequest {
    constructor(
        public title: string,
        public description: string,
        public authorId: ObjectId,
        public sourceBranch: string,
        public targetBranch: string,
        public status: 'open' | 'merged' | 'closed',
        public reviews: ObjectId[] = [],
        public approvalCount: number = 0,
        public changesRequestedCount: number = 0,
        public createdAt: Date = new Date(),
        public _id?: ObjectId
    ) {}
}
