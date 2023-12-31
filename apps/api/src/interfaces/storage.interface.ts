

export interface StorageService {
    uploadMP3(buffer: Buffer, fileName: string): Promise<string>
}