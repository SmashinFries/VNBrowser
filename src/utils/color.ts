export const rgbToRgba = (rgb: string, alpha: number) => {
    if (rgb.includes('rgba')) {
        return rgb;
    }
    return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
};
