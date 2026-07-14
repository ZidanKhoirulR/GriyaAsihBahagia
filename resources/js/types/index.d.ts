export interface User {
    id: number;
    nama_lengkap: string;
    nik: number;
    role: 'pengurus_rw' | 'sekretaris' | 'bendahara' | 'warga';
    is_active: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
