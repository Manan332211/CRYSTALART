import { useState } from 'react';

// Get a free API key from remove.bg
const API_KEY = 'BcwTd43tw3S97SUBBng85rbF';

export const useImageProcessor = () => {
    const [loading, setLoading] = useState(false);

    const processImage = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: { 'X-Api-Key': API_KEY },
                body: formData,
            });

            if (!response.ok) throw new Error('API Error');

            const blob = await response.blob();
            return URL.createObjectURL(blob); // This is the transparent PNG
        } catch (err) {
            console.error("AI Processing Failed:", err);
            return URL.createObjectURL(file); // Fallback to original if API fails
        } finally {
            setLoading(false);
        }
    };

    return { processImage, loading };
};