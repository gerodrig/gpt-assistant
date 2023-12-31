import { Module } from '@nestjs/common';
import { S3Adapter } from './s3.adapter';

@Module({
    providers: [S3Adapter],
    exports: [S3Adapter],
})
export class AdaptersModule {}
