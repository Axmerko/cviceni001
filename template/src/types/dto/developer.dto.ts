import { IsString, IsEmail, MinLength } from 'class-validator';

export class DeveloperDto {
    @IsString()
    @MinLength(1, { message: 'Name is required' })
    name!: string;

    @IsEmail({}, { message: 'Invalid email' })
    email!: string;

    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    username!: string;
}