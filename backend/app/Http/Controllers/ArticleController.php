<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Article::latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'link' => 'nullable|url',
            'published_at' => 'nullable|date',
        ]);

        $article = Article::create($validated);

        return response()->json($article, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Article::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'link' => 'nullable|url',
            'is_updated' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Article::destroy($id);
        return response()->noContent();
    }

    /**
     * Get the latest article based on published_at or created_at
     */
    public function latest()
    {
        $article = Article::latest('id')->first();
        
        if (!$article) {
            return response()->json(null);
        }

        return response()->json($article);
    }

    /**
     * Get the first pending article (not updated)
     */
    public function pending()
    {
        $article = Article::where('is_updated', false)
            ->orWhere('content', 'LIKE', '%placeholder%')
            ->oldest('id')
            ->first();

        if (!$article) {
            return response()->json(null);
        }

        return response()->json($article);
    }
}
