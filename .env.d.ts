declare namespace NodeJS {
  interface ProcessEnv {
    readonly API: string;
    readonly GOOGLE_GENERATIVE_AI_API_KEY: string;
  }
}
