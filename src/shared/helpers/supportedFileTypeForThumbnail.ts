export const supportedThumbnailGenerationFormats = (contentType: string) => {
    return ['pdf', 'docx', 'pptx'].includes(contentType);
};
