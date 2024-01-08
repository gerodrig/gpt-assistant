import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import * as sharp from 'sharp';

export const cacheImageToBase64 = async (
  base64Image: string
): Promise<any> => {
 
  //remove header 
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');
  
  const folderPath = path.resolve('./', './generated/images');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${uuid()}-64.png`;

  const completePath = path.join(folderPath, imageNamePng);


  //?Transform to RGBA, png
  await sharp(imageBuffer).png().ensureAlpha().toFile(completePath);

  return [completePath, imageNamePng];

};
