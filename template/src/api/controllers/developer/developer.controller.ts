import 'reflect-metadata';
import { Request, Response } from 'express';
import { validateBody, validateParams } from "../../../middleware/validation.middleware";
import { IdParam } from "../../../types/base.dto";
import { DeveloperDto } from "../../../types/dto/developer.dto";
import { developerService } from "../../../services/developer.service";
import { ApiError } from "../../../types/api.error";

export class DeveloperController {

    async create(req: Request, res: Response) {
        //TODO
    }


}
