<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

class ProxyRequestController extends Controller
{
    public function handleProxy(Request $request)
    {

        $client = new Client();

        // $client->s
        try {
            $apiResponse = $client->request(
                $this->getRequestMethod($request),
                $this->getRequestURL($request),
                $this->getRequestOptions($request)
            )->getBody()->getContents();
        } catch (RequestException $e) {
            $apiResponse = (string) $e->getResponse()->getBody();
        }
        return response()->json($apiResponse);
    }

    private function getRequestMethod(Request $request)
    {
        return $request->get('method', 'GET');
    }

    private function getRequestURL(Request $request)
    {
        return $request->get('url');
    }

    private function getRequestOptions(Request $request)
    {
        $options = [];
        if ($multipart = $this->processMultipart($request)) {
            $options['multipart'] = $multipart;
        }
        return $options;
    }

    private function processMultipart(Request $request)
    {
        if (!$request->has('formData')) {
            return false;
        }
        $multipart = [];
        foreach ($request->get('formData') as $key => $value) {
            $multipart[] = [
                'name' => $key,
                'contents' => $value
            ];
        }
        return $multipart;
    }
}
