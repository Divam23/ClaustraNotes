import { configDotenv } from 'dotenv';
import { storage } from '@/firebase/admin';
import { StorageProvider } from '../interfaces/storage.interface';

configDotenv();

class FirebaseStorageProvider implements StorageProvider {
  private bucket = storage;

  
  async uploadFile(file: Buffer, path: string, mimeType: string): Promise<string> {
    const fileUpload = this.bucket.file(path);
    await fileUpload.save(file,{
      metadata:{
        contentType:mimeType
      }
    })
    
    return path;
  }
  
  async generateSignedDownloadUrl(path: string): Promise<string> {
    const file = this.bucket.file(path);
    const expiryMinutes = Number(process.env.SIGNED_URL_EXPIRY_MINUTES ?? 5);

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + expiryMinutes * 60 * 60
    });

    return signedUrl;
  }

  async deleteFile(path: string): Promise<void> {
      await this.bucket.file(path).delete();
  }
}

export default new FirebaseStorageProvider;
