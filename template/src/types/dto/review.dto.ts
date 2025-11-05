import { IsString, IsArray, ValidateNested, IsIn, MinLength, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewCommentDto {
    @IsString()
    @MinLength(1)
    text!: string;

    @IsNumber()
    @Min(1)
    lineNumber!: number;
}

export class ReviewDto {

    @IsString()
    pullRequestId!: string;

    @IsString()
    reviewerId!: string;

    @IsString()
    @IsIn(['approve', 'request_changes', 'comment'])
    decision!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReviewCommentDto)
    comments!: ReviewCommentDto[];
}
