import { PostSliceI } from "@/types/types";
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
    morePosts: [],
  },
  loading: false,
  skeletonLoading: false,
  loadingMore: false,
  page: 1,
  maxPosts: 0,
  maxExplorePosts: 0,
};

export const getFeed = createAsyncThunk(
  "posts/getFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/feed?page=${page}`);
    return parsed.json();
  }
);

export const exploreFeed = createAsyncThunk(
  "posts/exploreFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/exploreFeed?page=${page}`);
    return parsed.json();
  }
);

export const getPost = createAsyncThunk(
  "posts/getPost",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/posts/post/${postId}`);
    return parsed.json();
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({
    caption,
    media,
    kind,
    user,
  }: {
    caption: string;
    media: Blob[];
    kind: "image" | "video";
    user: string;
  }) => {
    const formData = new FormData();
    formData.append("caption", caption);
    media.forEach((file) => {
      formData.append("media", file);
    });
    formData.append("kind", kind);
    formData.append("user", user);
    const parsed = await fetch("/api/v1/posts", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/posts/delete/${postId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

export const likePost = createAsyncThunk(
  "posts/like",
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const parsed = await fetch(`/api/v1/posts/like/${postId}`);
    return parsed.json();
  }
);

export const dislikePost = createAsyncThunk(
  "posts/dislike",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/posts/dislike/${postId}`);
    return parsed.json();
  }
);

export const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (userId: string) => {
    if (!userId)
      return {
        success: false,
        message: "User ID is required",
        status: 404,
        data: null,
      };
    const parsed = await fetch(`/api/v1/posts/user/${userId}`);
    return parsed.json();
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload.success) {
          state.posts = [...state.posts, ...action.payload.data.posts];
          state.maxPosts = action.payload.data.max;
          state.page = action.payload.data.page;
        }
      })
      .addCase(getFeed.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(exploreFeed.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(exploreFeed.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload.success) {
          state.explorePosts = [...state.explorePosts, ...action.payload.data.posts];
          state.maxExplorePosts = action.payload.max;
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
        if (action.payload.success) {
          state.post = action.payload.data.post;
          state.posts = action.payload.data.relatedPosts;
        }
      })
      .addCase(getPost.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.posts.unshift(action.payload.data.post);
        }
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.posts = state.posts.filter(
            (post) => post._id !== action.payload.data._id
          );
        }
      })
      .addCase(deletePost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(likePost.pending, (state, action) => {
        state.loading = true;
        state.posts.map((post) => {
          if (post._id === action.meta.arg.postId) {
            post.likes.push(action.meta.arg.userId);
            post.likesCount += 1;
          }
          return post;
        });
      })
      .addCase(likePost.fulfilled || likePost.rejected, (state, action) => {
        state.loading = false;
        if (action.payload.success) return;
        state.posts.map((post) => {
          if (post._id === action.payload.data._id) {
            post.likes = post.likes.filter(
              (like) => like !== action.meta.arg.userId
            );
            post.likesCount -= 1;
          }
          return post;
        });
      });

    builder
      .addCase(dislikePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(dislikePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.posts.map((post) => {
            if (post._id === action.payload.data._id && post.likesCount > 0) {
              post.likesCount -= 1;
            }
            return post;
          });
        }
      })
      .addCase(dislikePost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getUserPosts.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload.success) {
          state.posts = action.payload.data;
          state.maxPosts = action.payload.data;
        }
      })
      .addCase(getUserPosts.rejected, (state) => {
        state.skeletonLoading = false;
      });
  },
});

export default postSlice.reducer;
