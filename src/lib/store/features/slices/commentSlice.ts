import { CommentSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: CommentSliceI = {
  comments: [],
  comment: {
    _id: "",
    content: "",
    user: {
      _id: "",
      username: "",
      fullName: "",
      avatar: "",
    },
    post: "",
    likes: [],
    likesCount: 0,
  },
  likes: [],
  loading: false,
  skeletonLoading: false,
  loadingMore: false,
  page: 1,
};

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, content }: { postId: string; content: string }) => {
    const parsed = await fetch("/api/v1/comments/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, content }),
    });
    return parsed.json();
  }
);

export const getComments = createAsyncThunk(
  "comments/get",
  async ({ postId }: { postId: string }) => {
    const parsed = await fetch(`/api/v1/comments/${postId}`);
    return parsed.json();
  }
);

export const likeComment = createAsyncThunk(
  "comments/like",
  async (commentId: string) => {
    const parsed = await fetch(`/api/v1/comments/like/${commentId}`);
    return parsed.json();
  }
);

export const dislikeComment = createAsyncThunk(
  "comments/dislike",
  async (commentId: string) => {
    const parsed = await fetch(`/api/v1/comments/dislike/${commentId}`);
    return parsed.json();
  }
);

export const getLikes = createAsyncThunk(
  "comments/likes",
  async (commentId: string) => {
    const parsed = await fetch(`/api/v1/comments/likes/${commentId}`);
    return parsed.json();
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId: string) => {
    const parsed = await fetch(`/api/v1/comments/delete/${commentId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.comments = [action.payload.data, ...state.comments];
        }
      })
      .addCase(createComment.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getComments.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.comments = action.payload.data;
        } else if (action.payload?.message === "No comments found") {
          state.comments = [];
        }
      })
      .addCase(getComments.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(likeComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.comments = state.comments.map((comment) => {
          if (comment._id === action.payload._id) {
            return action.payload.data;
          }
          return comment;
        });
      })
      .addCase(likeComment.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(dislikeComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
        state.comments = state.comments.map((comment) => {
          if (comment._id === action.payload._id) {
            return action.payload.data;
          }
          return comment;
        });
      })
      .addCase(dislikeComment.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLikes.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.likes = action.payload.data;
        }
        state.loading = false;
      })
      .addCase(getLikes.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.meta.arg
        );
      })
      .addCase(deleteComment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default commentSlice.reducer;
