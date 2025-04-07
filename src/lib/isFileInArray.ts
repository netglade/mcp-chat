export function isFileInArray(file: File, existingFiles: File[]) {
    return existingFiles.some(
        (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.type === file.type,
    )
}
