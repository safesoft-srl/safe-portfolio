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
            'image_id' => $uploadedFile->getPublicId(),
        ];
    }

    public function uploadLogo($file): array
    {
        $type = $file->getClientOriginalExtension();

        $options = [
            'folder' => 'skills/logos',
        ];

        if ($type === 'svg') {
            $options['resource_type'] = 'image';
        }

        $uploadedFile = Cloudinary::upload(
            $file->getRealPath(),
            $options
        );

        return [
            'url' => $uploadedFile->getSecurePath(),
        ];
    }
}
