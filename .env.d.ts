declare namespace NodeJS {
  interface ProcessEnv {
    readonly API: string;
    readonly GOOGLE_GENERATIVE_AI_API_KEY: string;
    readonly SPOTIFY_CLIENT_ID: string;
    readonly SPOTIFY_CLIENT_SECRET: string;
  }
}

declare module '*.md';
