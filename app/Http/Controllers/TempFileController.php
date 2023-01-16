<?php

namespace App\Http\Controllers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TempFileController extends Controller
{
    /**
     * Handles download request for temporary file
     *
     * @param Request $request
     * @param string $path
     * @param string $f
     *
     * @return Response | StreamedResponse
     */
    public function handleDownload(Request $request, $path)
    {
        if (!$request->hasValidSignature()) {
            return response()->json(['status' => false, 'message' => 'URL maybe expired or invalid'], 404);
        }
        return Storage::disk('tmp')->download($path, $request->get('file'));
    }

    /**
     * moves the uploaded files if file exists in request
     *
     * @param Request $request
     * @return array
     */
    public function moveUploadedFiles($request)
    {
        $allFiles = $request->allFiles();
        if (empty($allFiles)) {
            return;
        }

        $this->validateFiles($request);
        $disk = Storage::disk('tmp');
        $fileLinks = [];
        foreach ($allFiles as $requestParamName => $files) {
            if (is_array($files)) {
                foreach ($files as $index => $file) {
                    $disk->putFileAs('', $file, $file->hashName());
                    $fileLinks[$requestParamName][$index] = $this->getTempUrl($disk, $file, 2);
                }
            } elseif (!empty($files)) {
                $disk->putFileAs('', $files, $files->hashName());
                $fileLinks[$requestParamName] = $this->getTempUrl($disk, $files, 2);
            }
        }
        return $fileLinks;
    }

    /**
     * Generates temporary signed url for a file in a disk
     *
     * @param Filesystem $disk
     * @param UploadedFile $file
     * @param int $duration
     *
     * @return string
     */
    public function getTempUrl($disk, $file, $duration)
    {
        return $disk->temporaryUrl(
            $file->hashName(),
            now()->addHours($duration),
            ['file' => $file->getClientOriginalName()]
        );
    }
    /**
     * Validates requested files
     *
     * @param Request $request
     * @return void
     */
    public function validateFiles($request)
    {
        $rules = [];
        $messages = [];
        foreach ($request->allFiles() as $key => $file) {
            if (is_array($file)) {
                $rules[$key . '.*'] = 'max:5120';
                $messages[$key . '.*.max'] = 'The :attribute may not be greater than 5MB.';
            } else {
                $rules[$key] = 'max:5120';
                $messages[$key . '.max'] = 'The :attribute may not be greater than 5MB.';
            }
        }

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            throw new HttpResponseException(response()->json([
                'success'   => false,
                'message'   => 'Validation errors',
                'data'      => $validator->errors()
            ]));
        }
    }
}
