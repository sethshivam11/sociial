"use client";

import VideoLoading from "@/components/skeletons/VideoLoading";
import VideoItem from "@/components/VideoItem";
import { setAudio, videoFeed } from "@/lib/store/features/slices/postSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";

function Videos() {
  const dispatch = useAppDispatch();
  const { posts, skeletonLoading, audio } = useAppSelector(
    (state) => state.post
  );
  const { user, skeletonLoading: userLoading } = useAppSelector(
    (state) => state.user
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(!audio);

  const handleKeys = useCallback(
    (e: KeyboardEvent) => {
      const idx = activeIndex;
      const activeVideo = idx !== null ? videoRefs.current[idx] : null;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (activeVideo) {
            if (activeVideo.paused) {
              activeVideo.play();
            } else {
              activeVideo.pause();
            }
          }
          break;
        case "KeyM":
          setIsMuted((prev) => !prev);
          break;
        case "ArrowRight":
          if (activeVideo)
            activeVideo.currentTime = activeVideo.currentTime + 5;
          break;
        case "ArrowLeft":
          if (activeVideo)
            activeVideo.currentTime = activeVideo.currentTime - 5;
          break;
        default:
          break;
      }
    },
    [activeIndex, dispatch]
  );

  const debounce = useDebounceCallback((entry: IntersectionObserverEntry) => {
    const videoElement = entry.target as HTMLVideoElement;
    const index = Number(videoElement.dataset.index);
    if (entry.isIntersecting) {
      Object.values(videoRefs.current).forEach((v, i) => {
        if (v && Number((v as HTMLVideoElement).dataset.index) !== index) {
          v.pause();
        }
      });
      videoElement.currentTime = 0;
      videoElement.play().then(() => setActiveIndex(index));
    } else {
      videoElement.pause();
      if (activeIndex === index) setActiveIndex(null);
    }
  }, 100);

  useEffect(() => {
    const videos = containerRef.current?.querySelectorAll("video") || [];
    const observers: IntersectionObserver[] = [];

    videos.forEach((video, idx) => {
      if (video) {
        video.setAttribute("data-index", String(idx));

        videoRefs.current[idx] = video as HTMLVideoElement;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) debounce(entry);
            });
          },
          {
            threshold: 0.9,
            root: containerRef.current,
            rootMargin: "100px",
          }
        );
        observer.observe(video);
        observers.push(observer);

        const containerRect = containerRef.current?.getBoundingClientRect();
        const videoRect = video.getBoundingClientRect();
        if (
          containerRect &&
          videoRect.top >= containerRect.top &&
          videoRect.bottom <= containerRect.bottom
        ) {
          (video as HTMLVideoElement)
            .play()
            .then(() => setActiveIndex(idx))
            .catch((err) => console.log(err));
        }
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [posts.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [handleKeys]);

  useEffect(() => {
    if (userLoading || !user._id) return;
    dispatch(videoFeed(1));
  }, [user._id, userLoading, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setAudio(!isMuted));
      console.log("audio state:", !isMuted);
    };
  }, [isMuted]);

  return (
    <div
      className="max-h-[100dvh] min-h-[42rem] h-[100dvh] xl:col-span-8 sm:col-span-9 col-span-10 snap-y snap-mandatory overflow-auto relative no-scrollbar"
      ref={containerRef}
    >
      {posts.length > 0 &&
        (skeletonLoading ? (
          <VideoLoading />
        ) : (
          posts.map((post, index) => (
            <section
              className="flex items-center justify-center snap-always snap-end w-full h-full py-2 max-sm:bg-stone-950"
              key={index}
            >
              <VideoItem
                post={post}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                key={index}
                videoRef={{ current: videoRefs.current[index] }}
              />
            </section>
          ))
        ))}
    </div>
  );
}

export default Videos;
