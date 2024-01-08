import * as fs from "fs";
import * as path from "path";
import {v4 as uuid} from 'uuid';
import { InternalServerErrorException } from "@nestjs/common";


export const cacheImage = async ( url: string, name?: string) => {

    const response = await fetch(url);

    if(!response.ok) {
        throw new InternalServerErrorException('Failed to cache image');
    }

    const folderPath = path.resolve('./', './generated/images');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = name ? `${uuid()}-${name}.png` : `${uuid()}.png`;
    const buffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(path.resolve(folderPath, imageNamePng), buffer);

    return [path.resolve(folderPath, imageNamePng), imageNamePng];
};