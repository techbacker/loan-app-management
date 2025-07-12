/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOAN_APPLICATION_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
