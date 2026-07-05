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
  label: string;
  trackUrl: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
  {
    label: 'No music',
    trackUrl: '',
  },
  {
    label: 'Lofi Girl — 4 A.M Study Session',
    trackUrl: 'https://api.soundcloud.com/tracks/1035841942',
  },
  {
    label: 'Chillhop — Study & Relax',
    trackUrl: 'https://api.soundcloud.com/tracks/1281633667',
  },
  {
    label: 'Ambient Rain & Piano',
    trackUrl: 'https://api.soundcloud.com/tracks/1101472953',
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
