/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        domains: ["example.com", "picsum.photos", "lh3.googleusercontent.com", "utfs.uploadthing.com"],
        remotePatterns: [
            {
              hostname: "utfs.io",
            },
          ],
    },
    // headers: async () => {
    //     return [
    //         {
    //             source: "/api/trpc/profil",
    //             headers: [
    //                 {
    //                     key: "Cache-Control",
    //                     value: "public, s-maxage=90, max-age=90",
    //                 },
    //             ],
    //         },
    //     ];
    // },
};

export default config;