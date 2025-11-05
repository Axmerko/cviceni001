import 'reflect-metadata';
import { Request, Response } from 'express';
import { validateBody, validateParams } from "../../../middleware/validation.middleware";
import { IdParam } from "../../../types/base.dto";
import { ReviewDto } from "../../../types/dto/review.dto";
import { reviewService } from "../../../services/review.service";
import { ApiError } from "../../../types/api.error";

export class ReviewController {

    async create(req: Request, res: Response) {
        //TODO
    }

}
