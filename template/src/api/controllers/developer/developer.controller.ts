import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { validateBody } from "../../../middleware/validation.middleware";
import { DeveloperDto } from "../../../types/dto/developer.dto";
import { developerService } from "../../../services/developer.service";

export class DeveloperController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {

            const developerDto = await validateBody(req, DeveloperDto);


            const newDeveloper = await developerService.create(developerDto);


            res.status(201).json(newDeveloper);
        } catch (error) {

            next(error);
        }
    }
}