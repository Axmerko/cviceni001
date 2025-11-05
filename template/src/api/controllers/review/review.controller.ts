import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { validateBody } from "../../../middleware/validation.middleware";
import { ReviewDto } from "../../../types/dto/review.dto";
import { reviewService } from "../../../services/review.service";

export class ReviewController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {

            const reviewDto = await validateBody(req, ReviewDto);


            const newReview = await reviewService.create(reviewDto);

            res.status(201).json(newReview);
        } catch (error) {
            next(error);
        }
    }
}