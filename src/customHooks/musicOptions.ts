// A small, vetted list of embeddable SoundCloud tracks for focus/background
// music. Using SoundCloud's own player iframe pointed at public track URLs
// is the intended/standard way to embed their content (same idea as
// embedding a YouTube video) — no scraping or rehosting of audio involved.
//
// Deliberately curated rather than free-text: it removes the ability for
// arbitrary HTML/script to be injected into the page (the previous
// implementation piped a raw text input straight into
// dangerouslySetInnerHTML), and it's a much lower-friction UX than asking
// users to go find and paste SoundCloud embed HTML themselves.

export interface MusicOption {
  category: string;
  label: string;
  trackUrl: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
  {
    category: 'General',
    label: 'No music',
    trackUrl: '',
  },
  {
    category: 'Featured',
    label: 'Lofi Girl',
    trackUrl: 'https://api.soundcloud.com/tracks/1035841942',
  },
  {
    category: 'Featured',
    label: 'Chillhop Study',
    trackUrl: 'https://api.soundcloud.com/tracks/1281633667',
  },
  {
    category: 'Featured',
    label: 'Rain + Piano',
    trackUrl: 'https://soundcloud.com/soothingrelaxation/relaxing-music-soft-rain-sounds-relaxing-piano-music-sleep-music-peaceful-music-148',
  },
  // {
  //   category: 'Deep Focus Piano',
  //   label: 'Minimal Piano',
  //   trackUrl:
  //     'https://soundcloud.com/softofficemusic-music/minimal-piano-for-deep-focus',
  // },
  // {
  //   category: 'Deep Focus Piano',
  //   label: 'Calming Piano',
  //   trackUrl:
  //     'https://soundcloud.com/study-deepfocus/calming-piano-for-deep-focus',
  // },
  {
    category: 'Noise',
    label: 'Brown Noise (12h)',
    trackUrl:
      'https://soundcloud.com/12hoursofbrownnoise/12-hours-of-brown-noise-focus',
  },
  {
    category: 'Binaural Alpha',
    label: 'Memory + Concentration',
    trackUrl:
      'https://soundcloud.com/eng-mohammed-shalan/study-music-alpha-waves-super-memory-concentration',
  },
  {
    category: 'Binaural Alpha',
    label: 'Focus + Study Playlist',
    trackUrl:
      'https://soundcloud.com/spiritualmoment/insomnia-relief-fall-asleep-fast-binaural-beats-sleep-music',
  },
  {
    category: 'Ambient Drone',
    label: 'Drone Ambient',
    trackUrl: 'https://soundcloud.com/space-v8/drone-ambient',
  },
  {
    category: 'Ambient Drone',
    label: 'Cosmic Drone Vol. 1',
    trackUrl: 'https://soundcloud.com/space-v8/cosmic-ambient-drone-vol-1',
  },
  {
    category: 'Cafe Jazz',
    label: 'Free Jazz Cafe',
    trackUrl: 'https://soundcloud.com/bgmusiclab/free-jazz-cafe-background-music',
  },
  {
    category: 'Cafe Jazz',
    label: 'Office Work Jazz',
    trackUrl: 'https://soundcloud.com/relaxcafemusic/sets/office-work-jazz-background',
  },
  {
    category: 'Nature',
    label: 'Rainforest Ambience',
    trackUrl: 'https://soundcloud.com/naturesoundcollection/rainforest-ambience',
  },
  {
    category: 'Nature',
    label: 'Rainforest Playlist',
    trackUrl: 'https://soundcloud.com/rainforestsounds/sets/rainforest-nature',
  },
  {
    category: 'Ocean Waves',
    label: 'Meditation Waves (75m)',
    trackUrl:
      'https://soundcloud.com/relaxing-white-noise/ocean-sounds-for-meditation-sleep-focus-or-stress-relief-75-minutes',
  },
  {
    category: 'Ocean Waves',
    label: 'Paradise Beach (75m)',
    trackUrl:
      'https://soundcloud.com/relaxing-white-noise/paradise-beach-ocean-waves',
  },
];

// Builds a SoundCloud player embed URL. auto_play is fine here because
// choosing a track from the dropdown is itself a user gesture — this is
// different from autoplaying music the user never asked for on page load.
export const buildSoundCloudSrc = (trackUrl: string) => {
  const params = new URLSearchParams({
    url: trackUrl,
    color: '#545e81',
    auto_play: 'true',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
};
