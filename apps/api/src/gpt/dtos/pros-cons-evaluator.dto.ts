import { IsString } from "class-validator";

export class ProsConsEvaluatorDto {
    @IsString()
    readonly prompt: string;
}