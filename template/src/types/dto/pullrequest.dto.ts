import {IsString, MinLength, IsIn, Length} from 'class-validator';

export class PullRequestDto {
    @IsString()
    @MinLength(5, { message: 'Title must be at least 5 characters' })
    title!: string;

    @IsString()
    @MinLength(10, { message: 'Description must be at least 10 characters' })
    description!: string;

    @IsString()
    @Length(24, 24, { message: 'Invalid authorId format' })
    authorId!: string;

    @IsString()
    @MinLength(1)
    sourceBranch!: string;

    @IsString()
    @MinLength(1)
    targetBranch!: string;

    @IsString()
    @IsIn(['open', 'merged', 'closed'], { message: 'Invalid status' })
    status!: 'open' | 'merged' | 'closed';
}