import {beforeEach, describe, expect, it} from "vitest";
import request from "../request";
import {ObjectId} from "mongodb";
import mongo from "../../src/database/mongo";

describe('Review System', () => {
    beforeEach(async () => {
        await mongo.db!.collection('developers').insertMany([
            {
                _id: new ObjectId('507f1f77bcf86cd799439011'),
                name: 'John Doe',
                email: 'john@example.com',
                username: 'johndoe',
                pullRequests: [],
                reviews: []
            },
            {
                _id: new ObjectId('507f1f77bcf86cd799439012'),
                name: 'Jane Smith',
                email: 'jane@example.com',
                username: 'janesmith',
                pullRequests: [],
                reviews: []
            },
            {
                _id: new ObjectId('507f1f77bcf86cd799439013'),
                name: 'Bob Wilson',
                email: 'bob@example.com',
                username: 'bobwilson',
                pullRequests: [],
                reviews: []
            }
        ]);
        
        await mongo.db!.collection('pullRequests').insertMany([
            {
                _id: new ObjectId('507f1f77bcf86cd799439021'),
                title: 'Add authentication',
                description: 'Implementing JWT authentication',
                authorId: new ObjectId('507f1f77bcf86cd799439011'),
                sourceBranch: 'feature/auth',
                targetBranch: 'main',
                status: 'open',
                reviews: [],
                approvalCount: 0,
                changesRequestedCount: 0,
                createdAt: new Date()
            },
            {
                _id: new ObjectId('507f1f77bcf86cd799439022'),
                title: 'Fix bug',
                description: 'Fixing critical bug',
                authorId: new ObjectId('507f1f77bcf86cd799439012'),
                sourceBranch: 'bugfix/critical',
                targetBranch: 'main',
                status: 'merged',
                reviews: [],
                approvalCount: 0,
                changesRequestedCount: 0,
                createdAt: new Date()
            }
        ]);
    });

    describe('POST /reviews', () => {
        it('successfully creates a review with approval [2pts]', async () => {
            const reviewData = {
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439012',
                decision: 'approve',
                comments: [
                    { text: 'Looks good to me!', lineNumber: 1 },
                    { text: 'Nice implementation', lineNumber: 42 }
                ]
            };

            const res = await request.post('/reviews').send(reviewData);
            
            expect(res.status).toBe(201);
            expect(res.body.pullRequestId).toBe('507f1f77bcf86cd799439021');
            expect(res.body.reviewerId).toBe('507f1f77bcf86cd799439012');
            expect(res.body.decision).toBe('approve');
            expect(res.body.comments).toHaveLength(2);
            expect(res.body._id).toBeDefined();
            
            // Verify approval count was increased
            const pr = await mongo.db!.collection('pullRequests').findOne({
                _id: new ObjectId('507f1f77bcf86cd799439021')
            });
            expect(pr?.approvalCount).toBe(1);
            expect(pr?.changesRequestedCount).toBe(0);
            
            // Verify review was added to PR
            expect(pr?.reviews).toHaveLength(1);
            
            // Verify review was added to reviewer
            const reviewer = await mongo.db!.collection('developers').findOne({
                _id: new ObjectId('507f1f77bcf86cd799439012')
            });
            expect(reviewer?.reviews).toHaveLength(1);
        });

        it('successfully creates a review requesting changes [2pts]', async () => {
            const reviewData = {
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439012',
                decision: 'request_changes',
                comments: [
                    { text: 'Need to add error handling', lineNumber: 15 }
                ]
            };

            const res = await request.post('/reviews').send(reviewData);
            
            expect(res.status).toBe(201);
            expect(res.body.decision).toBe('request_changes');
            
            // Verify changes requested count was increased
            const pr = await mongo.db!.collection('pullRequests').findOne({
                _id: new ObjectId('507f1f77bcf86cd799439021')
            });
            expect(pr?.changesRequestedCount).toBe(1);
            expect(pr?.approvalCount).toBe(0);
        });

        it('successfully creates a comment-only review [2pts]', async () => {
            const reviewData = {
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439012',
                decision: 'comment',
                comments: [
                    { text: 'Consider using async/await', lineNumber: 10 }
                ]
            };

            const res = await request.post('/reviews').send(reviewData);
            
            expect(res.status).toBe(201);
            expect(res.body.decision).toBe('comment');
            
            // Verify counts not changed for comment-only
            const pr = await mongo.db!.collection('pullRequests').findOne({
                _id: new ObjectId('507f1f77bcf86cd799439021')
            });
            expect(pr?.approvalCount).toBe(0);
            expect(pr?.changesRequestedCount).toBe(0);
        });

        it('returns 404 when pull request not found [1pts]', async () => {
            const res = await request.post('/reviews').send({
                pullRequestId: '507f1f77bcf86cd799439999',
                reviewerId: '507f1f77bcf86cd799439012',
                decision: 'approve',
                comments: []
            });
            
            expect(res.status).toBe(404);
            expect(res.body.message).toContain('Pull request not found');
        });

        it('returns 404 when reviewer not found [1pts]', async () => {
            const res = await request.post('/reviews').send({
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439999',
                decision: 'approve',
                comments: []
            });
            
            expect(res.status).toBe(404);
            expect(res.body.message).toContain('Reviewer not found');
        });

        it('returns 400 for invalid decision [1pts]', async () => {
            const res = await request.post('/reviews').send({
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439012',
                decision: 'invalid-decision',
                comments: []
            });
            
            expect(res.status).toBe(400);
        });

        it('returns 403 when trying to review own pull request [2pts]', async () => {
            const res = await request.post('/reviews').send({
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439011', // Same as PR author
                decision: 'approve',
                comments: []
            });
            
            expect(res.status).toBe(403);
            expect(res.body.message).toContain('Cannot review your own pull request');
        });

        it('returns 409 when reviewing a closed/merged pull request [2pts]', async () => {
            const res = await request.post('/reviews').send({
                pullRequestId: '507f1f77bcf86cd799439022', // Merged PR
                reviewerId: '507f1f77bcf86cd799439011',
                decision: 'approve',
                comments: []
            });
            
            expect(res.status).toBe(409);
            expect(res.body.message).toContain('Cannot review a closed or merged pull request');
        });


        it('handles multiple reviewers correctly [4pts]', async () => {
            // First reviewer approves
            await request.post('/reviews').send({
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439012',
                decision: 'approve',
                comments: []
            });

            // Second reviewer requests changes
            const res = await request.post('/reviews').send({
                pullRequestId: '507f1f77bcf86cd799439021',
                reviewerId: '507f1f77bcf86cd799439013',
                decision: 'request_changes',
                comments: [{ text: 'Need tests', lineNumber: 1 }]
            });

            expect(res.status).toBe(201);

            // Verify both counts updated
            const pr = await mongo.db!.collection('pullRequests').findOne({
                _id: new ObjectId('507f1f77bcf86cd799439021')
            });
            expect(pr?.approvalCount).toBe(1);
            expect(pr?.changesRequestedCount).toBe(1);
            expect(pr?.reviews).toHaveLength(2);
        });
    });
});
