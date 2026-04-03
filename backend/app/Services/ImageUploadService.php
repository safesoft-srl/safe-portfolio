<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ImageUploadService
{
    public function upload($file): string
    {
        $uploadedFile = Cloudinary::upload(
            $file->getRealPath(),
            [
                'folder' => 'portfolios',
            ]
        );

        return $uploadedFile->getSecurePath();
    }
}
