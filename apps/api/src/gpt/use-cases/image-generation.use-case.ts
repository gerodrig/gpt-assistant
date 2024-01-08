import * as fs from 'fs';
import { OpenAI } from 'openai';
import { cacheImage } from 'src/helpers';
import { cacheImageToBase64 } from '../../helpers/cache-image-to-base64';

type Options = {
  prompt: string;
  originalImage?: string;
  maskImage?: string;

};

export const imageGenerationUseCase = async (
  openai: OpenAI,
  { prompt, originalImage, maskImage }: Options,

) => {
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    // console.log(response);

    return {
      url: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  //convert originalImage to base64

  const [originalImageUploadable, cachedImageName] = await cacheImage(originalImage);
  const [maskImageUploadable, cachedMaskName] = await cacheImageToBase64(maskImage);
  
  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt: prompt,
    image: fs.createReadStream(originalImageUploadable),
    mask: fs.createReadStream(maskImageUploadable),
    n: 1,
    size: '1024x1024',
    response_format: 'url',

  });

  //TODO: delete cached image and masked cached image in fs

  return {
    url: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
