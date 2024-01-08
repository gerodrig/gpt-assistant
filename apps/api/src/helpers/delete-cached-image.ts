import * as fs from 'fs';
import * as path from 'path';

export const deleteCachedImage = async (fileName: string) => {
    
        const folderPath = path.resolve('./', './generated/images');

        if(!fs.existsSync(path.resolve(folderPath, fileName))) {
            return;
        }

        fs.unlinkSync(path.resolve(folderPath, fileName));

};