import React, { useEffect, useRef } from "react";

type YouTubePlayerHandle = {
  getCurrentTime: () => number;
};

type YouTubeEmbedProps = {
  videoId: string;
  onReady?: (player: YouTubePlayerHandle) => void;
};

let youtubeApiPromise: Promise<any> | null = null;

const loadYouTubeIframeApi = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  const w = window as any;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(w.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
};

const YouTubeEmbedInner = ({ videoId, onReady }: YouTubeEmbedProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const currentVideoRef = useRef<string | null>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!videoId || !hostRef.current || currentVideoRef.current === videoId) return;

    let cancelled = false;
    const host = hostRef.current;
    currentVideoRef.current = videoId;
    host.replaceChildren();

    const mount = document.createElement("div");
    host.appendChild(mount);

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !YT?.Player) return;
      playerRef.current = new YT.Player(mount, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          cc_load_policy: 1,
          cc_lang_pref: "en",
          playsinline: 1,
        },
        events: {
          onReady: () => {
            onReadyRef.current?.({
              getCurrentTime: () => {
                try {
                  return Number(playerRef.current?.getCurrentTime?.() || 0);
                } catch {
                  return 0;
                }
              },
            });
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (playerRef.current && currentVideoRef.current === videoId) {
        try {
          playerRef.current.destroy?.();
        } catch {}
        playerRef.current = null;
      }
      if (currentVideoRef.current === videoId) {
        host.replaceChildren();
        currentVideoRef.current = null;
      }
    };
  }, [videoId]);

  return <div ref={hostRef} className="ytc-player" />;
};

export const YouTubeEmbed = React.memo(
  YouTubeEmbedInner,
  (prev, next) => prev.videoId === next.videoId
);
