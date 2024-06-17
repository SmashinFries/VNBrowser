export const compareArrays = (a: any[], b: any[]) =>
    a.length === b.length && a.every((element, index) => element === b[index]);
