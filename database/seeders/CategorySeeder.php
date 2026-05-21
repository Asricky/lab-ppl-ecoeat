<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Vegetables',
            'Fruits',
            'Bakery',
        ];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        }
    }
}