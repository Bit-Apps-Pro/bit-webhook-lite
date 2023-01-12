<?php

namespace App\Http\Controllers;

use App\Models\Logs;
use App\Models\UrlSlugGenerate;
use DateTime;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

/**
 * WebHookController
 */
class WebHookController extends Controller
{
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
                $disk->putFileAs($request->url_slug, $files, $files->hashName());
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

    /**
     * Handle incoming request
     *
     * @param Request $request
     *
     * @return array
     */
    public function getRequestDetails($request)
    {
        $queryParams = $request->query();
        $formData = $request->post();
        if (($content = $request->getContent()) && empty($formData)) {
            $decoded = json_decode($content, true);
            if (json_last_error()) {
                $formData['body_content'] = $content;
            } else {
                $formData = array_merge($formData, $decoded);
            }
        }

        if ($fileLinks = $this->moveUploadedFiles($request)) {
            $formData = array_merge($formData, $fileLinks);
        }

        $headers = $request->header();
        $method = $request->method();
        $url = URL::full();
        $path = $request->path();
        $ip = $request->ip();

        if (isset($headers['cookie'])) {
            unset($headers['cookie']);
        }

        if (isset($headers['content-type']) && $headers['content-type'][0] == 'text/plain') {
            $formData = json_decode($request->getContent(), true);
        }

        $dateTime = new DateTime();
        $dateTime->setTimezone(new \DateTimeZone('Asia/Dhaka'));
        $createdLogTime = $dateTime->format('d-m-Y h:i:s A');

        return [
            'query_params' => $queryParams,
            'form_data'    => $formData,
            'headers'     => $headers,
            'method'      => $method,
            'url'         => $url,
            'path'        => $path,
            'ip'          => $ip,
            'created_at'  => $createdLogTime,
        ];
    }

    public function getWebHookData(Request $request, $url_slug)
    {
        $isValidURL = UrlSlugGenerate::where('url_slug', $url_slug)->first();

        if (!$isValidURL) {
            return response()->json(['success' => false, 'message' => 'Invalid URL']);
        }

        $details = $this->getRequestDetails($request);
        $rayID = uniqid();
        broadcast(new \App\Events\WebhookLogEvent($url_slug, [
            'id' => $rayID,
            'webhook_details' => json_encode($details),
        ]));

        return response()->json(['success' => true, 'data' => ['rID' => $rayID]]);
    }

    public function outgoingView()
    {
        return Inertia::render('Outgoing', [
            'canLogin'    => route('login'),
            'canRegister' => route('register'),
            'phpVersion'  => PHP_VERSION,
        ]);
    }
}
