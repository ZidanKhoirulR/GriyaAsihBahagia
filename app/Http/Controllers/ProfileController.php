<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Warga;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $warga = Warga::with('kartuKeluarga')->where('nik', $request->user()->nik)->first();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'warga' => $warga,
            'foto_profile_url' => $request->user()->foto_profile
                ? Storage::url($request->user()->foto_profile)
                : null,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $user->nama_lengkap = $validated['nama_lengkap'];
        $user->email = $validated['email'];

        // Handle foto profile upload
        if ($request->hasFile('foto_profile')) {
            // Hapus foto lama jika ada
            if ($user->foto_profile) {
                Storage::disk('public')->delete($user->foto_profile);
            }
            $path = $request->file('foto_profile')->store('foto_profile', 'public');
            $user->foto_profile = $path;
        }

        $user->save();

        $warga = Warga::where('nik', $user->nik)->first();
        if ($warga) {
            $warga->update([
                'nama_lengkap' => $validated['nama_lengkap'],
                'no_whatsapp' => $validated['no_whatsapp'] ?? $warga->no_whatsapp,
            ]);
        }

        return Redirect::route('profile.edit');
    }

    public function deleteFoto(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->foto_profile) {
            Storage::disk('public')->delete($user->foto_profile);
            $user->foto_profile = null;
            $user->save();
        }

        return back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
