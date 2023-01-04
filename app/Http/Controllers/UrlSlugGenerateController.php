<?php

namespace App\Http\Controllers;

use App\Models\UrlSlugGenerate;
use Illuminate\Http\Request;

class UrlSlugGenerateController extends Controller
{
    public function createNewRandomURl() {
        $uniqueId = uniqid();
        $saveUniqueId = new UrlSlugGenerate();
        $saveUniqueId->url_slug = $uniqueId;
        $save = $saveUniqueId->save();
        if ($save) {
            return response()->json([
                'success'   => true,
                'message'  => 'URL generated successfully',
                'uniqueId' => $uniqueId,
            ]);
        } else {
            return response()->json([
                'success'   => false,
                'message'  => 'URL generated failed',
                'uniqueId' => $uniqueId,
            ]);
        }
    }

    public function refreshUrl(Request $request) {
        $deleted = UrlSlugGenerate::where('url_slug', $request->url)->delete();
        if($deleted) {
            $uniqueId = uniqid();
            $saveUniqueId = new UrlSlugGenerate();
            $saveUniqueId->url_slug = $uniqueId;
            $save = $saveUniqueId->save();
            if ($save) {
                return response()->json([
                    'success'   => true,
                    'message'  => 'New URL generated successfully',
                    'uniqueId' => $uniqueId,
                ]);
            } else {
                return response()->json([
                    'success'   => false,
                    'message'  => 'New URL generated failed',
                    'uniqueId' => $uniqueId,
                ]);
            }
        }else{
            return response()->json([
                'success'   => false,
                'message'  => 'something went wrong',
            ]);
        }
    }
}
