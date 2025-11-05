import 'reflect-metadata';
import { Request, Response } from 'express';
import { validateBody, validateParams, validateQuery } from "../../../middleware/validation.middleware";
import { IdParam, SearchQuery } from "../../../types/base.dto";
import { PullRequestDto } from "../../../types/dto/pullrequest.dto";
import { pullRequestService } from "../../../services/pullrequest.service";
import { ApiError } from "../../../types/api.error";

export class PullRequestController {

    async getAll(req: Request, res: Response) {
        //TODO
    }

    async getById(req: Request, res: Response) {
        //TODO
    }

    async create(req: Request, res: Response) {
        //TODO
    }

    async update(req: Request, res: Response) {
        //TODO
    }

    async delete(req: Request, res: Response) {
        //TODO
    }

    async search(req: Request, res: Response) {
        //TODO
    }
}
