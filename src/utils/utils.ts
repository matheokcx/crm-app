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
            return "Lundi";
        case 2:
            return "Mardi";
        case 3:
            return "Mercredi";
        case 4:
            return "Jeudi";
        case 5:
            return "Vendredi";
        case 6:
            return "Samedi";
        case 0:
            return "Dimanche";
        default:
            return day.toString()
    }
};