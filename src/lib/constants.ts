export const ROUTES = {
  home: "/",
  auth: "/auth",
  quickplay: "/quickplay",
  quickplayCreate: "/quickplay/create",
  tinderArt: "/tinderart",
  tinderArtArena: "/tinderart/arena",
} as const;

export const TINDERART_STARTING_ELO = 1000;
export const TINDERART_ELO_UP = 12;
export const TINDERART_ELO_DOWN = 10;
export const DAILY_DRAW_SECONDS = 120;
