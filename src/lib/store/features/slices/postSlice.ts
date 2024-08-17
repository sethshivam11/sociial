import { PostSliceI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: PostSliceI = {
  posts: [],
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
    liked: false,
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
};

export const createFeed = createAsyncThunk("posts/createFeed", async () => {
  const parsed = await fetch("/api/v1/posts/createFeed");
  return parsed.json();
});

export const fetchMoreFeed = createAsyncThunk(
  "posts/fetchMoreFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/createFeed?page=${page}`);
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
    const parsed = await fetch(`/api/v1/posts/${postId}`);
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
  async (postId: string) => {
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

export const getMoreUserPosts = createAsyncThunk(
  "posts/getMoreUserPosts",
  async ({ userId, page }: { userId: string; page: number }) => {
    const parsed = await fetch(`/api/v1/posts/user/${userId}?page=${page}`);
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
      .addCase(createFeed.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(createFeed.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload.success) {
          state.posts = action.payload.data.posts;
          state.maxPosts = action.payload.data.max;
        }
      })
      .addCase(createFeed.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(fetchMoreFeed.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(fetchMoreFeed.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload.success) {
          state.posts.push(...action.payload.data.posts);
        }
      })
      .addCase(fetchMoreFeed.rejected, (state) => {
        state.loadingMore = false;
      });

    builder
      .addCase(exploreFeed.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(exploreFeed.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload.success) {
          state.posts.push(...action.payload.data.posts);
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
      .addCase(likePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.posts.map((post) => {
            if (post._id === action.payload.data._id) {
              post.likesCount += 1;
            }
            return post;
          });
        }
      })
      .addCase(likePost.rejected, (state) => {
        state.loading = false;
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

    builder
      .addCase(getMoreUserPosts.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(getMoreUserPosts.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload.success) {
          state.posts.push(...action.payload.data.posts);
        }
      })
      .addCase(getMoreUserPosts.rejected, (state) => {
        state.loadingMore = false;
      });
  },
});

export default postSlice.reducer;
