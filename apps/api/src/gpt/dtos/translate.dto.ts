import { IsBoolean, IsOptional, IsString } from "class-validator";

export class TranslateDto {
    
    @IsString()
    readonly prompt: string;

    @IsString()
    readonly language: string;

    @IsBoolean()
    @IsOptional()
    readonly stream: boolean;
}