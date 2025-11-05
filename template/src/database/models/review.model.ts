import { ObjectId } from "mongodb";

export class ReviewComment {
    constructor(
        public text: string,
        public lineNumber: number
    ) {}
}

export default class Review {
    constructor(
        public pullRequestId: ObjectId,
        public reviewerId: ObjectId,
        public decision: 'approve' | 'request_changes' | 'comment',
        public comments: ReviewComment[],
        public createdAt: Date = new Date(),
        public _id?: ObjectId
    ) {}
}
