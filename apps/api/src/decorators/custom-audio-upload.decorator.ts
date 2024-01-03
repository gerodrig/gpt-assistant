import { createParamDecorator, ExecutionContext, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator} from '@nestjs/common';

export const CustomAudioUpload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5MB'}),
                new FileTypeValidator({fileType: 'audio/*'})
              ],
            }).transform(request.file);

        return request.file;
    }
);