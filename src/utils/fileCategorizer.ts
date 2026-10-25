import { FileCategory } from '../types';

/**
 * Deterministic file categorizer based on extension and MIME type
 * Complies with requirement Section 8: Deterministic file categorization without AI claims.
 */
export function categorizeFile(fileName: string, mimeType?: string): FileCategory {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'md'];
  const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'];
  const vidExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v'];
  const audExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'];
  const arcExts = ['zip', 'rar', 'tar', 'gz', '7z', 'bz2', 'iso'];

  if (docExts.includes(ext) || (mimeType && (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text/')))) {
    return 'documents';
  }
  if (imgExts.includes(ext) || (mimeType && mimeType.startsWith('image/'))) {
    return 'images';
  }
  if (vidExts.includes(ext) || (mimeType && mimeType.startsWith('video/'))) {
    return 'videos';
  }
  if (audExts.includes(ext) || (mimeType && mimeType.startsWith('audio/'))) {
    return 'audio';
  }
  if (arcExts.includes(ext) || (mimeType && (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('tar')))) {
    return 'archives';
  }

  return 'other';
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recently';
  }
}
