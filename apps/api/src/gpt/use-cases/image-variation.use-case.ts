import OpenAI from "openai";
import * as fs from 'fs';
import { cacheImage, deleteCachedImage } from "src/helpers";

type Options = {
    baseImage: string;
}

export const imageVariationUseCase = async (
    openai: OpenAI,
    { baseImage }: Options,
) => {

    const [pngImage, nameCachedImage] = await cacheImage(baseImage);

    const response = await openai.images.createVariation({
        model: 'dall-e-2',   
        image: fs.createReadStream(pngImage),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
    });

    //? delete cached image in fs
    await deleteCachedImage(nameCachedImage);

    return {
        url: response.data[0].url,
        // revised_prompt: response.data[0].revised_prompt, 
    };
};