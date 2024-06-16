"use client"
import React from 'react'

function Videos() {
  const [isMuted, setIsMuted] = React.useState(true);

    const [videos, setVideos] = React.useState([
        {
            _id: "2",
            user: {
                fullName: "Shivam",
                username: "sethshivam11",
                avatar:
                    "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
            },
            caption:
                "This is a caption which is very long and I don't know what to write in it so, i am just keep going to see the results. This is just a test caption to check the functionality of the app. I hope you are having a good day. Bye! 😊",
            liked: false,
            images: ["https://res.cloudinary.com/dv3qbj0bn/video/upload/v1709183844/samples/dance-2.mp4"],
            likesCount: 12,
            commentsCount: 1,
        },
        {
            _id: "3",
            user: {
                fullName: "Shivam",
                username: "sethshivam11",
                avatar:
                    "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
            },
            caption: "This is a caption",
            liked: false,
            images: ["https://res.cloudinary.com/dv3qbj0bn/video/upload/v1718210710/sociial/videos/tnw4jy33z047bskwwhyt.mp4"],
            likesCount: 12,
            commentsCount: 1,
        },
    ]);

    // React.useEffect(() => {
    //     const videos = Array.from(document.querySelectorAll("video"));
    //     const observers: IntersectionObserver[] = [];
    //     let topVideo: HTMLVideoElement | undefined = undefined;

    //     const updateTopVideo = () => {
    //         const sortedVideos = [...videos].sort(
    //             (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
    //         );
    //         const newTopVideo = sortedVideos.find(
    //             (video) => video.getBoundingClientRect().top >= 0
    //         );

    //         if (newTopVideo !== topVideo) {
    //             if (topVideo) {
    //                 topVideo.pause();
    //             }
    //             topVideo = newTopVideo;
    //             if (topVideo) {
    //                 topVideo.play();
    //             }
    //         }
    //     };

    //     videos.forEach((video) => {
    //         const observer = new IntersectionObserver(
    //             (entries) => {
    //                 entries.forEach((entry) => {
    //                     if (entry.isIntersecting || video === topVideo) {
    //                         updateTopVideo();
    //                     }
    //                 });
    //             },
    //             {
    //                 threshold: 0.9,
    //                 root: null,
    //                 rootMargin: "100px",
    //             }
    //         );
    //         observer.observe(video);
    //         observers.push(observer);
    //     });

    //     return () => {
    //         videos.forEach((video, index) => {
    //             observers[index].unobserve(video);
    //         });
    //     };
    // }, [videos]);

    /*
    <div className="w-full relative">
                          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full text-white bg-transparent/20 dark:bg-transparent/35 p-3">
                            <Play size="40" fill="currentColor" />
                          </div>
                          <div className="absolute bottom-2 right-2 p-2 text-white bg-transparent/20 dark:bg-transparent/35 z-20 rounded-full">
                            {isMuted ? (
                              <VolumeX
                                size="15"
                                onClick={() => setIsMuted(!isMuted)}
                              />
                            ) : (
                              <Volume2
                                size="15"
                                onClick={() => setIsMuted(!isMuted)}
                              />
                            )}
                          </div>

                          <video
                            src={image}
                            muted={isMuted}
                            preload="auto"
                            className="max-h-[40rem] w-full object-cover rounded-sm"
                            onClick={(e) => {
                              const videoElement = e.target as HTMLVideoElement;
                              if (videoElement.paused) {
                                videoElement
                                  .play()
                                  .catch((err) => console.log(err));
                              } else {
                                videoElement.pause();
                              }
                              videoElement.defaultMuted = true;
                            }}
                            onPlay={(e) => {
                              const videos =
                                document.getElementsByTagName("video");
                              const videoElement = e.target as HTMLVideoElement;
                              const pauseIcon = videoElement.parentNode
                                ?.childNodes[0] as HTMLElement;
                              pauseIcon.classList.add("hidden");
                              for (let i = 0; i < videos.length; i++) {
                                const video = videos[i];

                                if (video !== e.target) {
                                  video.pause();
                                }
                              }
                            }}
                            onPause={(e) => {
                              const videoElement = e.target as HTMLVideoElement;
                              const pauseIcon = videoElement.parentNode
                                ?.childNodes[0] as HTMLElement;
                              pauseIcon.classList.remove("hidden");
                            }}
                          />
                        </div>
     */

    return (
        <div>Videos</div>
    )
}

export default Videos