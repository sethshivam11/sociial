import { PostSliceI } from "@/types/sliceTypes";
import { PostI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: PostSliceI = {
  posts: [],
  explorePosts: [],
  post: {
    _id: "",
    user: {
      _id: "",
      username: "",
      fullName: "",
      avatar: "",
      bio: "",
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
    },
    likes: [],
    caption: "",
    media: [],
    kind: "image",
    likesCount: 0,
    commentsCount: 0,
    createdAt: "",
    updatedAt: "",
    morePosts: [],
  },
  likes: [],
  loading: false,
  skeletonLoading: false,
  audio: false,
  loadingMore: false,
  page: 1,
  maxPosts: 0,
  maxExplorePosts: 0,
};

export const getFeed = createAsyncThunk(
  "posts/getFeed",
  async (page: number) => {
    const parsed = await fetch(
      `/api/v1/posts/feed?${page ? `page=${page}` : ""}`,
    );
    return parsed.json();
  },
);

export const exploreFeed = createAsyncThunk(
  "posts/exploreFeed",
  async ({ page, userId }: { page: number; userId?: string }) => {
    const parsed = await fetch(
      `/api/v1/posts/exploreFeed?page=${page}${
        userId ? `&userId=${userId}` : ""
      }`,
    );
    return parsed.json();
  },
);

export const videoFeed = createAsyncThunk(
  "posts/videoFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/videoFeed?page=${page}`);
    return parsed.json();
  },
);

export const getVideoPost = createAsyncThunk(
  "posts/getVideoPost",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/posts/videoPost/${postId}`);
    return parsed.json();
  },
);

export const getPost = createAsyncThunk(
  "posts/getPost",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/posts/post/${postId}`);
    return parsed.json();
  },
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({
    caption,
    media,
    user,
  }: {
    caption: string;
    media: File[];
    user: string;
  }) => {
    if (media.some((file) => !file.type.includes("image"))) {
      return {
        success: false,
        message: "File type is not supported",
        status: 400,
        data: null,
      };
    }
    const totalSize = media.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 100000000) {
      return {
        success: false,
        message: "File size is too large",
        status: 400,
        data: null,
      };
    }
    const formData = new FormData();
    formData.append("caption", caption);
    media.forEach((file) => {
      formData.append("media", file);
    });
    formData.append("user", user);
    const parsed = await fetch("/api/v1/posts/new", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  },
);

export const createVideoPost = createAsyncThunk(
  "posts/createVideoPost",
  async ({
    caption,
    media,
    user,
  }: {
    caption: string;
    media: File[];
    user: string;
  }) => {
    const totalSize = media.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 100000000) {
      return {
        success: false,
        message: "File size is too large",
        status: 400,
        data: null,
      };
    }
    const formData = new FormData();
    formData.append("caption", caption);
    media.forEach((file) => formData.append("media", file));
    const parsed = await fetch("/api/v1/posts/video", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  },
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/posts/delete/${postId}`, {
      method: "DELETE",
    });
    return parsed.json();
  },
);

export const likePost = createAsyncThunk(
  "posts/like",
  async ({
    postId,
    userId,
    type,
  }: {
    postId: string;
    userId: string;
    type: "explore" | "posts" | "post";
  }) => {
    const parsed = await fetch(`/api/v1/posts/like/${postId}`);
    return parsed.json();
  },
);

export const unlikePost = createAsyncThunk(
  "posts/dislike",
  async ({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
    type: "explore" | "posts" | "post";
  }) => {
    const parsed = await fetch(`/api/v1/posts/dislike/${postId}`);
    return parsed.json();
  },
);

export const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async ({ userId, username }: { userId?: string; username?: string }) => {
    if (!userId && !username)
      return {
        success: false,
        message: "User ID or username is required",
        status: 404,
        data: null,
      };
    const parsed = await fetch(
      `/api/v1/posts/user?${
        username ? `username=${username}` : `userId=${userId}`
      }`,
    );
    return parsed.json();
  },
);

export const fetchLikes = createAsyncThunk(
  "posts/fetchLikes",
  async (postId: string) => {
    if (!postId)
      return {
        success: false,
        message: "No likes found",
        status: 404,
        data: null,
      };
    const parsed = await fetch(`/api/v1/posts/getLikes/${postId}`);
    return parsed.json();
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    resetLikes(state) {
      state.likes = [];
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAudio(state, action) {
      state.audio = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state, action) => {
        if (action.meta.arg === 1) {
          state.skeletonLoading = true;
        }
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          const existingPosts = state.posts;
          const postsMap = new Map(
            existingPosts.map((post) => [post._id, post]),
          );

          action.payload.data.posts.forEach((post: PostI) =>
            postsMap.set(post._id, post),
          );
          state.posts = Array.from(postsMap.values()).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          state.maxPosts = action.payload.data.max;
          state.page = action.payload.data.page;
        }
      })
      .addCase(getFeed.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(exploreFeed.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loadingMore = true;
        }
      })
      .addCase(exploreFeed.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload?.success) {
          const existingPosts = state.explorePosts;
          const postsMap = new Map(
            existingPosts.map((post) => [post._id, post]),
          );

          action.payload.data.posts.forEach((post: PostI) =>
            postsMap.set(post._id, post),
          );
          state.explorePosts = Array.from(postsMap.values()).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          state.maxExplorePosts = action.payload.data.max;
          state.page = action.payload.data.page;
        }
      })
      .addCase(exploreFeed.rejected, (state) => {
        state.loadingMore = false;
      });

    builder
      .addCase(getPost.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.post = action.payload.data.post;
          state.post.morePosts = action.payload.data.relatedPosts;
        }
      })
      .addCase(getPost.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(getVideoPost.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getVideoPost.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.posts = action.payload.data.posts;
        }
      })
      .addCase(getVideoPost.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(videoFeed.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(videoFeed.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          const existingPosts = state.posts;
          const postsMap = new Map(
            existingPosts
              .filter((post) => post.kind === "video")
              .map((post) => [post._id, post]),
          );
          action.payload.data.forEach((post: PostI) =>
            postsMap.set(post._id, post),
          );
          state.posts = Array.from(postsMap.values()).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        } else if (action.payload.message === "No posts found") {
          state.posts = [];
        }
      })
      .addCase(videoFeed.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.posts.unshift(action.payload.data);
        }
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(createVideoPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.posts.unshift(action.payload.data);
        }
      })
      .addCase(createVideoPost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.posts = state.posts.filter(
            (post) => post._id !== action.payload.data._id,
          );
        }
      })
      .addCase(deletePost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(likePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          switch (action.meta.arg.type) {
            case "post": {
              state.post = {
                ...state.post,
                likes: [...state.post.likes, action.meta.arg.userId],
                likesCount: state.post.likesCount + 1,
                likesPreview: [
                  ...(state.post?.likesPreview || []),
                  action.payload.data,
                ],
              };
            }
            case "posts": {
              state.posts = state.posts.map((post) => {
                if (post._id === action.meta.arg.postId) {
                  return {
                    ...post,
                    likes: [...post.likes, action.meta.arg.userId],
                    likesCount: post.likesCount + 1,
                    likesPreview: [
                      ...(post?.likesPreview || []),
                      action.payload.data,
                    ],
                  };
                }
                return post;
              });
            }
            case "explore": {
              state.explorePosts = state.explorePosts.map((post) => {
                if (post._id === action.meta.arg.postId) {
                  return {
                    ...post,
                    likes: [...post.likes, action.meta.arg.userId],
                    likesCount: post.likesCount + 1,
                    likesPreview: [
                      ...(post?.likesPreview || []),
                      action.payload.data,
                    ],
                  };
                }
                return post;
              });
            }
          }
        }
      })
      .addCase(likePost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(unlikePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          switch (action.meta.arg.type) {
            case "post": {
              state.post = {
                ...state.post,
                likes: state.post.likes.filter(
                  (like) => like !== action.meta.arg.userId,
                ),
                likesCount:
                  state.post.likesCount > 0 ? state.post.likesCount - 1 : 0,
                likesPreview: state.post.likesPreview
                  ? state.post.likesPreview.filter(
                      (user) => user._id !== action.meta.arg.userId,
                    )
                  : [],
              };
            }
            case "posts": {
              state.posts = state.posts.map((post) => {
                if (post._id === action.meta.arg.postId) {
                  return {
                    ...post,
                    likes: post.likes.filter(
                      (like) => like !== action.meta.arg.userId,
                    ),
                    likesCount: post.likesCount > 0 ? post.likesCount - 1 : 0,
                    likesPreview: post.likesPreview
                      ? post.likesPreview.filter(
                          (user) => user._id !== action.meta.arg.userId,
                        )
                      : [],
                  };
                }
                return post;
              });
            }
            case "explore": {
              state.explorePosts = state.explorePosts.map((post) => {
                if (post._id === action.meta.arg.postId) {
                  return {
                    ...post,
                    likes: post.likes.filter(
                      (like) => like !== action.meta.arg.userId,
                    ),
                    likesCount: post.likesCount > 0 ? post.likesCount - 1 : 0,
                    likesPreview: post.likesPreview
                      ? post.likesPreview.filter(
                          (user) => user._id !== action.meta.arg.userId,
                        )
                      : [],
                  };
                }
                return post;
              });
            }
          }
        }
      })
      .addCase(unlikePost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getUserPosts.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.posts = action.payload.data;
          state.maxPosts = action.payload.data;
        } else if (
          !action.payload?.success &&
          action.payload?.message === "No posts found"
        ) {
          state.posts = [];
          state.maxPosts = 0;
        }
      })
      .addCase(getUserPosts.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.likes = action.payload.data;
        }
      })
      .addCase(fetchLikes.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default postSlice.reducer;
export const { setPage, resetLikes, setLoading, setAudio } = postSlice.actions;
