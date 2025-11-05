import { DeveloperController } from "./controllers/developer/developer.controller";
import { PullRequestController } from "./controllers/pullrequest/pullrequest.controller";
import { ReviewController } from "./controllers/review/review.controller";
import { apiErrorHandler } from "../middleware/error.middleware";
import express = require('express');

export const server = express()

server.use(express.json());
server.use(express.urlencoded({ extended: true }))

// Developers
const developerController = new DeveloperController();
server.post('/developers', developerController.create)


// Pull Requests
const pullRequestController = new PullRequestController();
server.get('/pullrequests', pullRequestController.getAll)
server.get('/pullrequests/search', pullRequestController.search)
server.get('/pullrequests/:id', pullRequestController.getById)
server.post('/pullrequests', pullRequestController.create)
server.put('/pullrequests/:id', pullRequestController.update)
server.delete('/pullrequests/:id', pullRequestController.delete)

// Reviews
const reviewController = new ReviewController();
server.post('/reviews', reviewController.create)


server.use(apiErrorHandler)
