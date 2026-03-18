/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PAGES_URL: string;
  readonly VITE_CORS_ORIGINS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
