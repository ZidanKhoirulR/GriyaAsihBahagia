<?php

namespace App\Traits;

use App\Models\Pengurus;

trait GetCurrentRt
{
    /**
     * Dapatkan nomor RT dari Pengurus RT yang sedang login.
     * Mengembalikan string RT (mis. "002") atau string kosong jika tidak ditemukan.
     */
    protected function getCurrentRt(): string
    {
        $user = auth()->user();
        if (!$user) return '';

        $pengurus = Pengurus::whereHas('warga', function ($q) use ($user) {
            $q->where('nik', $user->nik);
        })
            ->where('tingkat', 'rt')
            ->where('is_aktif', true)
            ->first();

        return $pengurus ? $pengurus->rt : '';
    }
}
