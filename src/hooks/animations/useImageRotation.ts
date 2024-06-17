import { useEffect, useState } from 'react';

const useImageRotation = (urls: string[], duration = 8000) => {
    const [image_src_idx, setImageSrcIdx] = useState<number>(0);

    const all_urls = urls.length > 0 ? [...new Set(urls)].filter((n) => n) : [];

    const updateImageSrc = () => {
        setImageSrcIdx((prev) => (prev + 1) % all_urls?.length);
    };

    useEffect(() => {
        if (urls) {
            const interval = setInterval(() => {
                updateImageSrc();
            }, duration);

            return () => {
                clearInterval(interval);
            };
        }
    }, []);

    if (!all_urls) return null;

    return all_urls[image_src_idx];
};

export default useImageRotation;
