import { translate } from 'libretranslate';

// Cache để lưu các bản dịch đã có
const translationCache = new Map();

export const translateToVietnamese = async (text) => {
    // Nếu text rỗng hoặc null thì return luôn
    if (!text) return text;

    // Kiểm tra cache trước
    if (translationCache.has(text)) {
        return translationCache.get(text);
    }

    try {
        const result = await translate({
            q: text,
            source: 'en',
            target: 'vi',
            format: 'text'
        });

        // Lưu vào cache
        translationCache.set(text, result.translatedText);

        return result.translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
};

// Hàm để dịch với retry
export const translateWithRetry = async (text, maxRetries = 3) => {
    if (!text) return text;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await translateToVietnamese(text);
        } catch (error) {
            if (i === maxRetries - 1) {
                console.error('Translation failed after retries:', error);
                return text;
            }
            // Đợi một chút trước khi thử lại
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

// Hàm để xóa cache khi cần
export const clearTranslationCache = () => {
    translationCache.clear();
}; 