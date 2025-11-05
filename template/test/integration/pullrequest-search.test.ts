import { beforeEach, describe, expect, it } from "vitest";
import request from "../request";
import { ObjectId } from "mongodb";
import mongo from "../../src/database/mongo";

describe("GET /pullrequests/search", () => {
    beforeEach(async () => {
        await mongo.db!.collection("developers").insertOne({
            _id: new ObjectId("507f1f77bcf86cd799439011"),
            name: "John Doe",
            email: "john@example.com",
            username: "johndoe",
            pullRequests: [],
            reviews: [],
        });

        await mongo.db!.collection("pullRequests").insertMany([
            {
                title: "Implement user authentication",
                description: "Adding JWT-based authentication",
                authorId: new ObjectId("507f1f77bcf86cd799439011"),
                sourceBranch: "feature/auth",
                targetBranch: "main",
                status: "open",
                reviews: [],
                approvalCount: 0,
                changesRequestedCount: 0,
                createdAt: new Date(),
            },
            {
                title: "Add user profile page",
                description: "Creating profile view for users",
                authorId: new ObjectId("507f1f77bcf86cd799439011"),
                sourceBranch: "feature/profile",
                targetBranch: "main",
                status: "open",
                reviews: [],
                approvalCount: 0,
                changesRequestedCount: 0,
                createdAt: new Date(),
            },
            {
                title: "Fix database connection",
                description: "Resolving MongoDB timeout issues",
                authorId: new ObjectId("507f1f77bcf86cd799439011"),
                sourceBranch: "bugfix/db",
                targetBranch: "main",
                status: "open",
                reviews: [],
                approvalCount: 0,
                changesRequestedCount: 0,
                createdAt: new Date(),
            },
        ]);
    });

    it("searches pull requests by title [1.5pts]", async () => {
        const res = await request.get(
            "/pullrequests/search?query=authentication"
        );
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe("Implement user authentication");
    });

    it("searches pull requests by description [1.5pts]", async () => {
        const res = await request.get("/pullrequests/search?query=user");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    it("searches pull requests by branch name [1.5pts]", async () => {
        const res = await request.get("/pullrequests/search?query=feature");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    it("returns empty array when no PRs match [1pts]", async () => {
        const res = await request.get("/pullrequests/search?query=nonexistent");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });

    it("returns 400 for query less than 2 characters [0.5pts]", async () => {
        const res = await request.get("/pullrequests/search?query=a");
        expect(res.status).toBe(400);
    });

    it("returns 400 for empty query [0.5pts]", async () => {
        const res = await request.get("/pullrequests/search?query=");
        expect(res.status).toBe(400);
    });

    it("returns 400 for missing query parameter [0.5pts]", async () => {
        const res = await request.get("/pullrequests/search");
        expect(res.status).toBe(400);
    });
});
