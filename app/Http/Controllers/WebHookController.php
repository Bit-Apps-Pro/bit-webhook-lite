<?php

namespace App\Http\Controllers;

use App\Models\Logs;
use App\Models\UrlSlugGenerate;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

/**
 * WebHookController
 */
class WebHookController extends Controller {
    /**
     * getWebHookData
     *
     * @param Request request
     *
     * @return void
     */
    // public function uploadFile($fileNames, $request) {
    //     if (empty($fileNames)) {
    //         return;
    //     }
    //     $fileLinks = [];

    //     foreach ($fileNames as $key => $files) {
    //         if (is_array($files)) {
    //             foreach ($files as $key => $file) {
    //                 if (! empty($request->{$file})) {
    //                     $imageName = uniqid().'.'.$request->{$file}->extension();
    //                     $request->{$file}->storeAs('/public/uploads/', $imageName);
    //                     $fileLinks[$file] = url('/storage/uploads/'.$imageName);
    //                 }
    //             }
    //         } else {
    //             if (! empty($files)) {
    //                 $imageName = uniqid().'.'.$request->{$key}->extension();
    //                 $files->storeAs('/public/uploads/', $imageName);
    //                 $fileLinks[$key] = url('/storage/uploads/'.$imageName);
    //             }
    //         }
    //     }

    //     return $fileLinks;
    // }

//    public function fileValidation($files, $data) {

//        if (empty($files)) {
//            return;
//        }

//        $rules = [];
//        $messages = [];
//        foreach ($files as $key => $file) {

//            if (is_array($file)) {
//                $rules[$key.'.*'] = 'max:5120';
//                $messages[$key.'.*.max'] = 'The :attribute may not be greater than 5MB.';
//            } else {
//                $rules[$key] = 'max:5120';
//                $messages[$key.'.max'] = 'The :attribute may not be greater than 5MB.';
//            }

//        }

//        $validator = Validator::make($data, $rules, $messages);
//        if ($validator->fails()) {
//            return response()->json(['success' => false, 'message' => $validator->errors()]);
//        }
//    }

    public function getReqeuestDetails($request) {
        $queryParams = $request->query();
        $formData = $request->post();
    
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

     public function getWebHookData(Request $request) {
         $urlSlugId = substr($request->url(), strrpos($request->url(), '/') + 1);
        
         $isValidURL = UrlSlugGenerate::where('url_slug', $urlSlugId)->first();

         if (! $isValidURL) {
             return response()->json(['success' => false, 'message' => 'Invalid URL']);
         }

         $details = $this->getReqeuestDetails($request);

         broadcast(new \App\Events\WebhookLogEvent($urlSlugId,[
                'id'=>uniqid(),
                'webhook_details'=>json_encode($details),
         ]));

         return response()->json(['success' => true, 'data' => []]);
     }

}
