import * as sharp from 'sharp';

export const convertImageToPng = async (imageBuffer: Buffer): Promise<Buffer> => {

    return await sharp(imageBuffer).png().ensureAlpha().toBuffer();
}