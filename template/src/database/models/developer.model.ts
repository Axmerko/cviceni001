import { ObjectId } from "mongodb";

export default class Developer {
    constructor(
        public name: string,
        public email: string,
        public username: string,
        public pullRequests: ObjectId[] = [],
        public reviews: ObjectId[] = [],
        public _id?: ObjectId
    ) {}
}
