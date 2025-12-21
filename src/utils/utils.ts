export const FILES_DIRECTORY: string = "public/files";
export const FILE_LIMIT_SIZE: number = 5 * 1024 * 1024; // 5 MB

export const getMimeType = (filename: string): string => {
    const fileExtension: string = filename.split('.').pop()?.toLowerCase() ?? "";
    const types: Record<string, string> = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'txt': 'text/plain'
    };

    return types[fileExtension] ?? 'application/octet-stream';
};
