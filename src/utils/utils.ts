import path from "path";
import {writeFile} from "fs/promises";

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

export const manageUrlQueryParams = (searchParams:  URLSearchParams, allowedFilterFields: string[]): Record<string, any> => {
    const queryParams: Record<string, any> = {};

    searchParams.forEach((value, key) => {
        if (!allowedFilterFields.includes(key)) {
            return;
        }

        if (value === "true") {
            queryParams[key] = true;
        }
        else if (value === "false") {
            queryParams[key] = false;
        }

        else if (!isNaN(Number(value)) && value.trim() !== "") {
            queryParams[key] = Number(value);
        }
        else {
            if (key === "name") {
                queryParams[key] = { contains: value, mode: 'insensitive' };
            }
            else {
                queryParams[key] = value;
            }
        }
    });

    return queryParams;
};

export const getWeekDay = (day: number): string => {
    switch(day){
        case 1:
            return "monday";
        case 2:
            return "tuesday";
        case 3:
            return "wednesday";
        case 4:
            return "thursday";
        case 5:
            return "friday";
        case 6:
            return "saturday";
        case 0:
            return "sunday";
        default:
            return day.toString()
    }
};

export const getFormattedDate = (date: Date): string => {
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const day: string = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const uploadFile = async (file: File, filePrefix: string): Promise<string> => {
    const today: number = Date.now();

    try{
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `${filePrefix}_${today}_${file.name}`);

        await writeFile(newFilePath, buffer);
        return `/files/${filePrefix}_${today}_${file.name}`;
    } catch(error: any) {
        console.error(error.message);
        return error.message;
    }
};
