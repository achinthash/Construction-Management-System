<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectImage;

class ProjectImageController extends Controller
{
    // new image (multiple) // ok

    // fetch images based types on project id  //ok
    // ablums all images // ok
    // fetch images all   // ok
    // delete image // ok 



    public function imagesAlbums($project_id){

        $images = ProjectImage::Select('project_images.*')
            ->where('project_images.project_id', $project_id)
            ->get();

        $albums = $images->groupBy('img_type')->map(function ($albumImages, $type){

            return [
                'type' => $type, 
                'image_count' => $albumImages->count(),
                'last_image' => $albumImages->last()?->image_path,
            ];

        })->values(); 

        return response()->json($albums);

    }

    // album images 
    public function getImagesByAlbum($project_id, $album_name)
    {
        
        $images = ProjectImage::where('project_id', $project_id)
                            ->where('img_type', $album_name)
                            ->get();
        return response()->json($images);
    }

    // task images 
    public function imagesByTask($project_id,$task_id)
    {
        
        $images = ProjectImage::where('project_id', $project_id)
                            ->where('img_type', 'Task Image')
                            ->where('img_referenced_id', $task_id)
                            ->get();
        return response()->json($images);
    }


    // selected image 

    public function image($id){

        $image = ProjectImage::findOrfail($id);

        return response()->json($image);
    }

    public function deleteImage($id){
        
        $image = ProjectImage::findOrfail($id);

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully'], 200);
    }


    public function newImage(Request $request){

        $request->validate([

            'project_id' => ['required', 'exists:projects,id'],
            'img_type' => ['required', 'string', 'max:25'],
            'image_path' => ['required', 'array'],
            'image_path.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:20048'],
            'img_referenced_id' => ['nullable', 'numeric']
           
        ]);

        if(!empty($request->image_path)){

            foreach ($request->file('image_path') as $key => $image) {
                $imageName = now()->format('Ymd_His'). $image->getClientOriginalName();

                $imagePath = $image->store('project_pictures', 'public');

                ProjectImage::create([
                    'img_type' => $request->img_type,
                    'image_name' => $imageName,
                    'image_path' => $imagePath,
                    'project_id' => $request->project_id,
                    'img_referenced_id' => $request->img_referenced_id,
                ]);
            } 

            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully!',
            ], 201);

        }

        
       
    }


    public function imagesByType($project_id,$type){

        $images = ProjectImage::Select('project_images.*')
            ->where('project_images.project_id', $project_id)
            ->where('project_images.img_type', $type)
            ->get();
        return response()->json( $images, 201);
    }


    
    public function imagesByTypeItem($project_id,$type,$item){

        $images = ProjectImage::Select('project_images.*')
            ->where('project_images.project_id', $project_id)
            ->where('project_images.img_type', $type)
            ->where('project_images.img_referenced_id', $item)
            ->get();
        return response()->json( $images, 201);
    }


    

}
