<?php

namespace App\Services;

use App\Models\KycDocument;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class KycService
{
    /**
     * @param  array<string, UploadedFile>  $documents
     * @return Collection<int, KycDocument>
     *
     * @throws ValidationException
     */
    public function uploadDocuments(User $user, array $documents): Collection
    {
        $requiredDocuments = $this->requiredDocumentsForRole($user->role);

        return DB::transaction(function () use ($user, $documents, $requiredDocuments): Collection {
            $storedDocuments = collect();

            foreach ($requiredDocuments as $documentType) {
                if (! isset($documents[$documentType])) {
                    throw ValidationException::withMessages([
                        "documents.$documentType" => [strtoupper($documentType).' document is required.'],
                    ]);
                }

                $fileUrl = $this->uploadToCloudinary($documents[$documentType], $user, $documentType);

                $storedDocuments->push(KycDocument::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'document_type' => $documentType,
                    ],
                    [
                        'file_url' => $fileUrl,
                        'status' => 'pending',
                    ],
                )->fresh());
            }

            return $storedDocuments;
        });
    }

    /**
     * @return list<string>
     */
    public function requiredDocumentsForRole(string $role): array
    {
        return match ($role) {
            'buyer' => ['ktp'],
            'seller' => ['ktp', 'nib'],
            'courier' => ['ktp', 'sim'],
            default => [],
        };
    }

    private function uploadToCloudinary(UploadedFile $file, User $user, string $documentType): string
    {
        $response = cloudinary()->uploadApi()->upload($file->getRealPath(), [
            'folder' => 'ecoeat/kyc/'.$user->id,
            'public_id' => $documentType.'_'.Str::uuid()->toString(),
            'resource_type' => 'auto',
        ]);

        $secureUrl = $response['secure_url'] ?? $response['url'] ?? null;

        if (! is_string($secureUrl) || $secureUrl === '') {
            throw new RuntimeException('Cloudinary upload did not return a valid file URL.');
        }

        return $secureUrl;
    }
}
