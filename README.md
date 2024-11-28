# Anmategra App

Build With [T3 Stack](https://create.t3.gg/)

## Branch Name Convention
```
<tipe>/<BE/FE> /<deskripsi>
```

Contoh : `feat/BE/LandingPage`

## Aturan Semantic Commit

1. Format Umum :
```
<tipe>(<scope>): <deskripsi>
```

2. Tipe Commit :
- `feat`: Menambahkan fitur baru.
- `fix`: Memperbaiki bug.
- `docs`: Mengubah dokumentasi.
- `style`: Perubahan yang tidak mempengaruhi logika (formatting, spasi, dll).
- `refactor`: Perubahan kode yang tidak menambah fitur atau memperbaiki bug.
- `test`: Menambahkan atau memperbaiki pengujian.
- `chore`: Tugas rutin yang tidak termasuk dalam kategori di atas (pengaturan build, perubahan dependensi, dll).

Contoh : `fix(api): resolve CORS issue`

## Penamaan Component atau Actions

1. Komponen (Components) :
- Format : `PascalCase`
- Contoh : `UserProfile`, `NavBar`, `Button`

2. Actions : 
- Format : `camelCase`
- Contoh : `fetchUserData`, `updateProfile`, `handleSubmit`

3. Folder dan File :
- Format : `kebab-case`
- Contoh : `user-profile.tsx`, `nav-bar.tsx`, `api-enpoint.ts`
