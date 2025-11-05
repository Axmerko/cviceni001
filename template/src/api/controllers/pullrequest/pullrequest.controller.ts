import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { validateBody, validateParams, validateQuery } from "../../../middleware/validation.middleware";
import { IdParam, SearchQuery } from "../../../types/base.dto";
import { PullRequestDto } from "../../../types/dto/pullrequest.dto";
import { pullRequestService } from "../../../services/pullrequest.service";
import { ApiError } from "../../../types/api.error";

export class PullRequestController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const pullRequests = await pullRequestService.getAll();
            res.status(200).json(pullRequests);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = await validateParams(req, IdParam);
            const pullRequest = await pullRequestService.getById(id!);
            res.status(200).json(pullRequest);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const pullRequestDto = await validateBody(req, PullRequestDto);
            const newPullRequest = await pullRequestService.create(pullRequestDto);
            res.status(201).json(newPullRequest);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = await validateParams(req, IdParam);
            const pullRequestDto = await validateBody(req, PullRequestDto);
            const updatedPullRequest = await pullRequestService.update(id!, pullRequestDto);
            res.status(200).json(updatedPullRequest);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = await validateParams(req, IdParam);
            await pullRequestService.delete(id!);
            res.status(204).send(); // 204 No Content
        } catch (error) {
            next(error);
        }
    }

    async search(req: Request, res: Response, next: NextFunction) {
        try {

            const { query } = await validateQuery(req, SearchQuery);
            const results = await pullRequestService.search(query!);
            res.status(200).json(results);
        } catch (error) {
            next(error);
        }
    }
}