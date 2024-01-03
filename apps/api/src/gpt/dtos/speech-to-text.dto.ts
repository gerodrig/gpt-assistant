import { IsOptional, IsString } from "class-validator";


export class SpeechToTextDto {

    @IsString()
    @IsOptional()
    prompt: string;
}