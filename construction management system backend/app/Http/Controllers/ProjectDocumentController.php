<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectDocument;

class ProjectDocumentController extends Controller
{
    // new file 
    // fetch folders base on project id with name
    // files based on folder name and project id 
    // delete file


    // folders 

    public function folders($project_id){

        $files = ProjectDocument::select('project_documents.*')
            ->where('project_id',$project_id)
            ->get();


        $folders = $files->groupBy('doc_type')->map(function($folderFiles, $type ){

            return [
                'type' =>  $type,
                'file_count' => $folderFiles->count()
            ];
        })->values();

        return response()->json($folders);
    }


    // folder files 

    public function files($project_id, $folder_name){

        $files = ProjectDocument::where('project_id', $project_id)
                    ->where('doc_type', $folder_name)
                    ->get();

        return response()->json($files);
    }

     // task documents 

     public function filesTasks($project_id, $task_id){

        $files = ProjectDocument::where('project_id', $project_id)
                    ->where('doc_type', 'Task Documents')
                    ->where('doc_referenced_id', $task_id)
                    ->get();

        return response()->json($files);
    }



    // delete

    public function deleteDocument($id){

        $document = ProjectDocument::findOrfail($id);

        $document->delete();

        return response()->json(['message' => 'Document deleted successfully'], 200);

    }

    // new doc

    //   ['img_type', 'project_id','image_name', 'image_path', 'img_referenced_id'];

    public function newDocument(Request $request){

        $request->validate([ 

            'project_id' => ['required', 'exists:projects,id'],

            'doc_type' => ['required', 'string', 'max:25'],
            'doc_path' => ['required', 'array'], 
            'doc_path.*' => ['required', 'file', 'mimes:pdf,doc,docx,xlsx,xls,csv,txt', 'max:935120'], 

            'doc_referenced_id' => ['nullable', 'integer'],


        ]);
        
        
     

        foreach ($request->file('doc_path') as $key => $document) {
            $docName = time() . '_' . $document->getClientOriginalName();
            $docPath = $document->store('project_documents', 'public');
            
            ProjectDocument::create([
                'doc_type' => $request->doc_type,
                'doc_name' => $docName,
                'doc_path' => $docPath,
                'project_id' => $request->project_id,
                'doc_referenced_id' =>   $request->doc_referenced_id,
            ]);
        }


        return response()->json(['message' => 'Document upload successfully'], 200);



    }



    public function documentsByTypeItem($project_id,$type,$item){

        $images = ProjectDocument::Select('project_documents.*')
            ->where('project_documents.project_id', $project_id)
            ->where('project_documents.doc_type', $type)
            ->where('project_documents.doc_referenced_id', $item)
            ->get();
        return response()->json( $images, 201);
    
    }



    public function newDocumentSingle(Request $request)
    {
        $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'doc_type' => ['required', 'string', 'max:25'],
            'doc_path' => ['required', 'file', 'mimes:pdf,doc,docx,xlsx,xls,csv,txt', 'max:455120'],
            'doc_referenced_id' => ['nullable', 'integer'],
        ]);
    
        // Get the uploaded file
        $document = $request->file('doc_path');
    
        // Create unique name and store the file
        $docName = time() . '_' . $document->getClientOriginalName();
        $docPath = $document->storeAs('project_documents', $docName, 'public');
    
        // Create the document record
        ProjectDocument::create([
            'doc_type' => $request->doc_type,
            'doc_name' => $docName,
            'doc_path' => $docPath,
            'project_id' => $request->project_id,
            'doc_referenced_id' => $request->doc_referenced_id,
        ]);
    
        return response()->json(['message' => 'Document uploaded successfully'], 200);
    }
    

    


}
