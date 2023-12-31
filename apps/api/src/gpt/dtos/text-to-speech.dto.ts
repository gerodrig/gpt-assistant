import { IsOptional, IsString } from "class-validator";


export class TextToSpeechDto {
    @IsString()
    readonly text: string;

    @IsString()
    @IsOptional()
    readonly voice: Voice;
}

//alloy, echo, fable, onyx, nova shimmer
export type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';