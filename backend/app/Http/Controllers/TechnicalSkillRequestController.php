<?php

namespace App\Http\Controllers;

use App\Models\TechnicalSkill;
use App\Models\TechnicalSkillRequest;
use App\Services\ImageUploadService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TechnicalSkillRequestController extends Controller
{
    public function __construct(private ImageUploadService $imageUploadService) {}

    public function index(Request $request)
    {
        $user = $request->user();

        $requests = TechnicalSkillRequest::where('user_id', $user->id)
            ->with([
                'reviewer:id,name',
                'finalSkill:id,name',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:45',
        ]);

        $user = $request->user();

        $normalizedInput = $this->normalize($request->name);

        $exists = TechnicalSkillRequest::where('user_id', $user->id)
            ->get()
            ->contains(function ($item) use ($normalizedInput) {
                return $this->normalize($item->name) === $normalizedInput;
            });

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Ya enviaste una solicitud con ese nombre',
            ], 422);
        }

        $alreadyExists = TechnicalSkill::all()
            ->contains(function ($item) use ($normalizedInput) {
                return $this->normalize($item->name) === $normalizedInput;
            });

        if ($alreadyExists) {
            return response()->json([
                'success' => false,
                'message' => 'La habilidad ya existe en el catálogo',
            ], 422);
        }

        $technicalRequest = TechnicalSkillRequest::create([
            'user_id' => $user->id,
            'name' => trim($request->name),
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solicitud enviada correctamente',
            'data' => $technicalRequest,
        ]);
    }

    public function moderatorIndex()
    {
        $requests = TechnicalSkillRequest::with([
            'user:id,name',
            'reviewer:id,name',
            'finalSkill:id,name',
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        $grouped = [];

        foreach ($requests as $request) {

            $normalized = $this->normalize(
                $request->name
            );

            $key =
                $normalized.
                '_'.
                $request->status;

            if (! isset($grouped[$key])) {

                $grouped[$key] = [

                    'display_name' => $this->formatDisplayName($normalized),

                    'normalized_name' => $normalized,
                    'status' => $request->status,
                    'count' => 0,
                    'latest_date' => $request->created_at,
                    'final_name' => optional($request->finalSkill)->name,
                    'reviewed_by' => optional($request->reviewer)->name,
                    'requests' => [],
                ];
            }

            $grouped[$key]['count']++;

            if (
                $request->created_at >
                $grouped[$key]['latest_date']
            ) {
                $grouped[$key]['latest_date'] =
                    $request->created_at;
            }

            $grouped[$key]['requests'][] = [
                'id' => $request->id,
                'user' => $request->user->name,
                'original_name' => $request->name,
                'status' => $request->status,
                'created_at' => $request->created_at,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => array_values($grouped),
        ]);
    }

    public function approveGroup(Request $request)
    {
        $request->validate([
            'normalized_name' => 'required|string',
            'final_name' => 'required|string|max:45',
            'category' => 'required|string|max:30',
            'url_light' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
            'url_dark' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
        ]);

        $normalizedName = $request->normalized_name;
        $finalName = trim($request->final_name);

        $alreadyExists = TechnicalSkill::all()
            ->contains(function ($item) use ($finalName) {

                return $this->normalize($item->name)
                    === $this->normalize($finalName);

            });

        if ($alreadyExists) {

            return response()->json([
                'success' => false,
                'message' => 'La habilidad ya existe en el catálogo',
            ], 422);

        }

        $data = [
            'name' => $finalName,
            'category' => $request->category,
        ];

        if ($request->hasFile('url_light')) {

            $logoData = $this->imageUploadService->uploadLogo(
                $request->file('url_light')
            );

            $data['url_light'] = $logoData['url'];
        }

        if ($request->hasFile('url_dark')) {

            $logoData = $this->imageUploadService->uploadLogo(
                $request->file('url_dark')
            );

            $data['url_dark'] = $logoData['url'];
        }
        $technicalSkill = TechnicalSkill::create($data);
        $requests = TechnicalSkillRequest::where('status', 'pending')
            ->get()
            ->filter(function ($item) use ($normalizedName) {
                return $this->normalize($item->name) === $normalizedName;
            });

        foreach ($requests as $item) {

            $item->update([
                'status' => 'approved',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => Carbon::now(),
                'final_skill_id' => $technicalSkill->id,
            ]);

        }

        return response()->json([
            'success' => true,
            'message' => 'Solicitudes aprobadas correctamente',
            'data' => $technicalSkill,
        ]);
    }

    public function rejectGroup(Request $request)
    {
        $request->validate([
            'normalized_name' => 'required|string',
        ]);

        $normalizedName = $request->normalized_name;

        $requests = TechnicalSkillRequest::where('status', 'pending')->get();

        foreach ($requests as $item) {

            if (
                $this->normalize($item->name) === $normalizedName &&
                $item->status === 'pending'
            ) {

                $item->update([
                    'status' => 'rejected',
                    'reviewed_by' => $request->user()->id,
                    'reviewed_at' => Carbon::now(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Solicitudes rechazadas correctamente',
        ]);
    }

    private function normalize($text)
    {
        $text = mb_strtolower($text, 'UTF-8');

        $replacements = [
            'á' => 'a',
            'é' => 'e',
            'í' => 'i',
            'ó' => 'o',
            'ú' => 'u',

            'à' => 'a',
            'è' => 'e',
            'ì' => 'i',
            'ò' => 'o',
            'ù' => 'u',
        ];

        return strtr(trim($text), $replacements);
    }

    private function formatDisplayName($text)
    {
        return mb_convert_case(
            $text,
            MB_CASE_TITLE,
            'UTF-8'
        );
    }
}
