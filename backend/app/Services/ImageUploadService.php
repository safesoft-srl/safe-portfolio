<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ImageUploadService
{
    public function upload($file): array
    {
        $uploadedFile = Cloudinary::upload(
            $file->getRealPath(),
            [
                'folder' => 'portfolios',
            ]
        );

        return [
            'url' => $uploadedFile->getSecurePath(),
            'image_id' => $uploadedFile->getPublicId()
        ];
    }
}
