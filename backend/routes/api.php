<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

Route::get('/articles/latest', [ArticleController::class, 'latest']);
Route::get('/articles/pending', [ArticleController::class, 'pending']);
Route::apiResource('articles', ArticleController::class);
