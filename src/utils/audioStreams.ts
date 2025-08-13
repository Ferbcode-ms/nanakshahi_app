// Golden Temple Live Gurbani Stream Configuration

export interface AudioStream {
  id: string;
  name: string;
  namePunjabi: string;
  url: string;
  description: string;
  descriptionPunjabi: string;
  isActive: boolean;
}

export const GOLDEN_TEMPLE_STREAMS: AudioStream[] = [
  {
    id: "golden-temple-main",
    name: "Golden Temple Main Stream",
    namePunjabi: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਮੁੱਖ ਸਟ੍ਰੀਮ",
    url: "https://stream.radio.co/s2e5b8b0c5/listen",
    description: "Live Gurbani from Sri Harmandir Sahib main stream",
    descriptionPunjabi: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਲਾਈਵ ਗੁਰਬਾਣੀ ਮੁੱਖ ਸਟ੍ਰੀਮ",
    isActive: true,
  },
  {
    id: "golden-temple-backup",
    name: "Golden Temple Backup Stream",
    namePunjabi: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਬੈਕਅੱਪ ਸਟ੍ਰੀਮ",
    url: "https://stream.radio.co/s2e5b8b0c5/listen",
    description: "Backup live Gurbani stream from Golden Temple",
    descriptionPunjabi: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਬੈਕਅੱਪ ਲਾਈਵ ਗੁਰਬਾਣੀ ਸਟ੍ਰੀਮ",
    isActive: false,
  },
];

// Get the primary stream URL
export const getPrimaryStreamUrl = (): string => {
  const primaryStream = GOLDEN_TEMPLE_STREAMS.find((stream) => stream.isActive);
  return primaryStream?.url || GOLDEN_TEMPLE_STREAMS[0].url;
};

// Audio configuration
export const AUDIO_CONFIG = {
  // Audio mode settings
  audioMode: {
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  },

  // Playback settings
  playbackOptions: {
    shouldPlay: true,
    isLooping: true,
    volume: 1.0,
    rate: 1.0,
    shouldCorrectPitch: true,
  },

  // Connection timeout (in milliseconds)
  connectionTimeout: 10000,

  // Retry attempts
  maxRetryAttempts: 3,

  // Retry delay (in milliseconds)
  retryDelay: 2000,
};
