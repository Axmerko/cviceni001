import {beforeEach, describe, expect, it} from "vitest";
import request from "../request";
import {ObjectId} from "mongodb";
import mongo from "../../src/database/mongo";

describe("Developer Management", () => {
    describe("POST /developers", () => {
        it("creates a new developer with valid data [1pts]", async () => {
            const developerData = {
                name: "Alice Johnson",
                email: "alice@example.com",
                username: "alicej",
            };

            const res = await request.post("/developers").send(developerData);
            expect(res.status).toBe(201);
            expect(res.body.name).toBe("Alice Johnson");
            expect(res.body.username).toBe("alicej");
        });

        it("returns 400 for invalid email [1pts]", async () => {
            const res = await request.post("/developers").send({
                name: "Alice Johnson",
                email: "invalid-email",
                username: "alicej",
            });
            expect(res.status).toBe(400);
        });

        it("returns 400 for missing name [1pts]", async () => {
            const res = await request.post("/developers").send({
                email: "alice@example.com",
                username: "alicej",
            });
            expect(res.status).toBe(400);
        });

        it("returns 400 for username less than 3 characters [1pts]", async () => {
            const res = await request.post("/developers").send({
                name: "Alice Johnson",
                email: "alice@example.com",
                username: "al",
            });
            expect(res.status).toBe(400);
        });
    });
});
