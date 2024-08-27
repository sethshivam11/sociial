declare module "browser-thumbnail-generator" {
  export interface ThumbnailOptions {
    file: File;
    width: number;
    height: number;
    maintainAspectRatio: boolean;
  }
  export default function generateMediaThumbnail(options: ThumbnailOptions): Promise<{
    thumbnail: Blob;
    width: number;
    height: number;
    size: number;
    original_size: number;
    timestamp: number;
  }>;
  export const supportedMimeTypes: string[];
}
