export const verifyStringLength = (minLength: number, maxLength: number, ...strings: string[]): boolean => {
    for (const str of strings) {
        if (str.length < minLength || str.length > maxLength) {
            return false;
        }
    }
    return true;
};
