<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'phone_number' => '0771234567',
            'address' => '123 Admin Street, Colombo',
            'status' => 'active',
            'nic' => '901234567V',
            'role' => 'admin',
            'position' => 'Project Manager',
        ]);

        // Optional: Create 5 dummy users using a factory
        // User::factory()->count(1)->create();
    }
}
