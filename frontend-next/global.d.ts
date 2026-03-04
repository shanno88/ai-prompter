interface Window {
  webkitAudioContext?: typeof AudioContext;
}

namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DEEPSEEK_API_KEY?: string;
  }
}
