<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
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
}
