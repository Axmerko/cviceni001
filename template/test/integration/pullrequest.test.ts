import { beforeEach, describe, expect, it } from "vitest";
import request from "../request";
import { ObjectId } from "mongodb";
import mongo from "../../src/database/mongo";

describe("Pull Request Management", () => {
    beforeEach(async () => {
        await mongo.db!.collection("developers").insertMany([
            {
                _id: new ObjectId("507f1f77bcf86cd799439011"),
                name: "John Doe",
                email: "john@example.com",
                username: "johndoe",
                pullRequests: [],
                reviews: [],
            },
            {
                _id: new ObjectId("507f1f77bcf86cd799439012"),
                name: "Jane Smith",
                email: "jane@example.com",
                username: "janesmith",
                pullRequests: [],
                reviews: [],
            },
        ]);

        await mongo.db!.collection("pullRequests").insertMany([
            {
                _id: new ObjectId("507f1f77bcf86cd799439021"),
                title: "Add user authentication",
                description: "Implementing JWT-based authentication system",
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
                title: "Fix database connection",
                description: "Resolving MongoDB connection timeout issues",
                authorId: new ObjectId("507f1f77bcf86cd799439012"),
                sourceBranch: "bugfix/db-connection",
                targetBranch: "main",
                status: "open",
                reviews: [],
                approvalCount: 0,
                changesRequestedCount: 0,
                createdAt: new Date(),
            },
        ]);
    });

    describe("GET /pullrequests", () => {
        it("returns all pull requests [0.5pts]", async () => {
            const res = await request.get("/pullrequests");
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].title).toBe("Add user authentication");
        });
    });

    describe("GET /pullrequests/:id", () => {
        it("returns pull request by id [0.5pts]", async () => {
            const res = await request.get(
                "/pullrequests/507f1f77bcf86cd799439021"
            );
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Add user authentication");
            expect(res.body.status).toBe("open");
        });

        it("returns 404 for non-existent pull request [1pts]", async () => {
            const res = await request.get("/pullrequests/507f1f77bcf86cd799439999");
            expect(res.status).toBe(404);
        });

        it("returns 400 for invalid id format [0.5pts]", async () => {
            const res = await request.get("/pullrequests/invalid-id");
            expect(res.status).toBe(400);
        });
    });

    describe("POST /pullrequests", () => {
        it("creates a new pull request with valid data [1pts]", async () => {
            const prData = {
                title: "Update README",
                description: "Adding installation instructions to README file",
                authorId: "507f1f77bcf86cd799439011",
                sourceBranch: "docs/readme",
                targetBranch: "main",
                status: "open",
            };

            const res = await request.post("/pullrequests").send(prData);
            expect(res.status).toBe(201);
            expect(res.body.title).toBe("Update README");
            expect(res.body.approvalCount).toBe(0);
            expect(res.body._id).toBeDefined();
        });

        it("returns 400 for missing title [0.5pts]", async () => {
            const res = await request.post("/pullrequests").send({
                description: "Test description",
                authorId: "507f1f77bcf86cd799439011",
                sourceBranch: "test",
                targetBranch: "main",
                status: "open",
            });
            expect(res.status).toBe(400);
        });

        it("returns 400 for title less than 5 characters [0.5pts]", async () => {
            const res = await request.post("/pullrequests").send({
                title: "Fix",
                description: "Test description here",
                authorId: "507f1f77bcf86cd799439011",
                sourceBranch: "test",
                targetBranch: "main",
                status: "open",
            });
            expect(res.status).toBe(400);
        });

        it("returns 400 for description less than 10 characters [0.5pts]", async () => {
            const res = await request.post("/pullrequests").send({
                title: "Fix bug in code",
                description: "Short",
                authorId: "507f1f77bcf86cd799439011",
                sourceBranch: "test",
                targetBranch: "main",
                status: "open",
            });
            expect(res.status).toBe(400);
        });

        it("returns 400 for invalid status [1pts]", async () => {
            const res = await request.post("/pullrequests").send({
                title: "Fix bug in code",
                description: "Detailed description here",
                authorId: "507f1f77bcf86cd799439011",
                sourceBranch: "test",
                targetBranch: "main",
                status: "invalid-status",
            });
            expect(res.status).toBe(400);
        });

        it("returns 404 for non-existent author [0.5pts]", async () => {
            const res = await request.post("/pullrequests").send({
                title: "Fix bug in code",
                description: "Detailed description here",
                authorId: "507f1f77bcf86cd799439999",
                sourceBranch: "test",
                targetBranch: "main",
                status: "open",
            });
            expect(res.status).toBe(404);
        });
    });

    describe("PUT /pullrequests/:id", () => {
        it("updates existing pull request [1pts]", async () => {
            const updateData = {
                title: "Add user authentication - Updated",
                description: "Implementing OAuth2 authentication system",
                authorId: "507f1f77bcf86cd799439011",
                sourceBranch: "feature/oauth",
                targetBranch: "main",
                status: "open",
            };

            const res = await request
                .put("/pullrequests/507f1f77bcf86cd799439021")
                .send(updateData);
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Add user authentication - Updated");
            expect(res.body.sourceBranch).toBe("feature/oauth");
        });

        it("returns 404 for non-existent pull request [2pts]", async () => {
            const res = await request
                .put("/pullrequests/507f1f77bcf86cd799439999")
                .send({
                    title: "Updated PR",
                    description: "Updated description here",
                    authorId: "507f1f77bcf86cd799439011",
                    sourceBranch: "test",
                    targetBranch: "main",
                    status: "open",
                });
            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /pullrequests/:id", () => {
        it("deletes existing pull request [1pts]", async () => {
            const res = await request.delete("/pullrequests/507f1f77bcf86cd799439021");
            expect(res.status).toBe(204);
        });
    });
});
