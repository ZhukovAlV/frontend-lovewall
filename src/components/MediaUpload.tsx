import React, { useState, useRef } from "react";
import { uploadMedia } from "../api/wallApi";
import "./MediaUpload.scss";

interface MediaUploadProps {
    onMediaUploaded: (fileUrl: string) => void;
    onError: (error: string) => void;
    category?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaUploaded, onError, category = "messages" }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'
        ];

        if (!allowedTypes.includes(file.type)) {
            onError('Поддерживаются только изображения (JPEG, PNG, GIF, WebP) и аудио файлы (MP3, WAV, OGG, M4A)');
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            onError('Размер файла не должен превышать 10MB');
            return;
        }

        setUploading(true);
        try {
            const result = await uploadMedia(file, category);
            onMediaUploaded(result.fileUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            onError('Не удалось загрузить файл. Попробуйте еще раз.');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="media-upload">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,audio/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <button
                type="button"
                className="media-upload-button"
                onClick={triggerFileSelect}
                disabled={uploading}
            >
                {uploading ? (
                    <>
                        <span className="upload-spinner">⏳</span>
                        Загрузка...
                    </>
                ) : (
                    <>
                        <span className="upload-icon">📎</span>
                        Прикрепить файл
                    </>
                )}
            </button>
        </div>
    );
};

export default MediaUpload;