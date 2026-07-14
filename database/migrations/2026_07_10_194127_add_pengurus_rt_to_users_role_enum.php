<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('pengurus_rw', 'pengurus_rt', 'sekretaris', 'bendahara', 'warga') DEFAULT 'warga'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users_role_enum', function (Blueprint $table) {
            //
        });
    }
};
