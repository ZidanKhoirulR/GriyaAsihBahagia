<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ], [
            'current_password.required'       => 'Password terakhir wajib diisi.',
            'current_password.current_password' => 'Password terakhir yang Anda masukkan salah.',
            'password.required'               => 'Password baru wajib diisi.',
            'password.confirmed'              => 'Konfirmasi password baru tidak cocok.',
            'password.min'                    => 'Password baru minimal 8 karakter.',
            'password.mixed_case'             => 'Password baru harus mengandung huruf kapital dan huruf kecil.',
            'password.numbers'                => 'Password baru harus mengandung angka.',
            'password.symbols'                => 'Password baru harus mengandung simbol (contoh: @, #, !, $).',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
