import { PostSliceI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: PostSliceI = {
  posts: [],
  post: {
    _id: "",
    user: "",
    caption: "",
    images: [],
    kind: "image",
    likesCount: 0,
    commentsCount: 0,
  },
  loading: false,
  skeletonLoading: false,
  loadingMore: false,
  page: 1,
  maxPosts: 0,
};

const createFeed = createAsyncThunk("posts/createFeed", async () => {
  const parsed = await fetch("/api/v1/posts/createFeed");
  return parsed.json();
});

const fetchMoreFeed = createAsyncThunk(
  "posts/fetchMoreFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/createFeed?page=${page}`);
    return parsed.json();
  }
);

const exploreFeed = createAsyncThunk(
  "posts/exploreFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/exploreFeed?page=${page}`);
    return parsed.json();
  }
);

const getPost = createAsyncThunk("posts/getPost", async (postId: string) => {
  const parsed = await fetch(`/api/v1/posts/${postId}`);
  return parsed.json();
});

const createPost = createAsyncThunk(
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

const deletePost = createAsyncThunk("posts/delete", async (postId: string) => {
  const parsed = await fetch(`/api/v1/posts/delete/${postId}`, {
    method: "DELETE",
  });
  return parsed.json();
});

const likePost = createAsyncThunk("posts/like", async (postId: string) => {
  const parsed = await fetch(`/api/v1/posts/like/${postId}`);
  return parsed.json();
});

const dislikePost = createAsyncThunk(
  "posts/dislike",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/posts/dislike/${postId}`);
    return parsed.json();
  }
);

const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/posts/user/${userId}`);
    return parsed.json();
  }
);

const getMoreUserPosts = createAsyncThunk(
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
    builder.addCase(createFeed.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(createFeed.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload.success) {
        state.posts = action.payload.data.posts;
        state.maxPosts = action.payload.data.max;
      }
    });
    builder.addCase(createFeed.rejected, (state) => {
      state.skeletonLoading = false;
    });

    builder.addCase(fetchMoreFeed.pending, (state) => {
      state.loadingMore = true;
    });
    builder.addCase(fetchMoreFeed.fulfilled, (state, action) => {
      state.loadingMore = false;
      if (action.payload.success) {
        state.posts.push(...action.payload.data.posts);
      }
    });
    builder.addCase(fetchMoreFeed.rejected, (state) => {
      state.loadingMore = false;
    });

    builder.addCase(exploreFeed.pending, (state) => {
      state.loadingMore = true;
    });
    builder.addCase(exploreFeed.fulfilled, (state, action) => {
      state.loadingMore = false;
      if (action.payload.success) {
        state.posts.push(...action.payload.data.posts);
      }
    });
    builder.addCase(exploreFeed.rejected, (state) => {
      state.loadingMore = false;
    });

    builder.addCase(getPost.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(getPost.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload.success) {
        state.post = action.payload.data.post;
        state.posts = action.payload.data.relatedPosts;
      }
    });
    builder.addCase(getPost.rejected, (state) => {
      state.skeletonLoading = false;
    });

    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.posts.unshift(action.payload.data.post);
      }
    });
    builder.addCase(createPost.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.data._id
        );
      }
    });
    builder.addCase(deletePost.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(likePost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(likePost.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.posts.map((post) => {
          if (post._id === action.payload.data._id) {
            post.likesCount += 1;
          }
          return post;
        });
      }
    });
    builder.addCase(likePost.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(dislikePost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(dislikePost.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.posts.map((post) => {
          if (post._id === action.payload.data._id && post.likesCount > 0) {
            post.likesCount -= 1;
          }
          return post;
        });
      }
    });
    builder.addCase(dislikePost.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getUserPosts.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload.success) {
        state.posts = action.payload.data.posts;
        state.maxPosts = action.payload.data.max;
      }
    });
    builder.addCase(getUserPosts.rejected, (state) => {
      state.skeletonLoading = false;
    });

    builder.addCase(getMoreUserPosts.pending, (state) => {
      state.loadingMore = true;
    });
    builder.addCase(getMoreUserPosts.fulfilled, (state, action) => {
      state.loadingMore = false;
      if (action.payload.success) {
        state.posts.push(...action.payload.data.posts);
      }
    });
    builder.addCase(getMoreUserPosts.rejected, (state) => {
      state.loadingMore = false;
    });
  },
});

export default postSlice.reducer;
