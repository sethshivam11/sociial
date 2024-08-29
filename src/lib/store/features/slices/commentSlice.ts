import { CommentSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: CommentSliceI = {
  comments: [],
  comment: {
    _id: "",
    comment: "",
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
  loading: false,
  skeletonLoading: false,
  loadingMore: false,
  page: 1,
};

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, comment }: { postId: string; comment: string }) => {
    const parsed = await fetch("/api/v1/comments/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, comment }),
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

export const getMoreComments = createAsyncThunk(
  "comments/getMore",
  async ({ postId, page }: { postId: string; page: number }) => {
    const parsed = await fetch(`/api/v1/comments/${postId}?page=${page}`);
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
    builder.addCase(createComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.comments = [action.payload.data, ...state.comments];
      }
    });
    builder.addCase(createComment.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getComments.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload?.success) {
        state.comments = action.payload.data;
      }
    });
    builder.addCase(getComments.rejected, (state) => {
      state.skeletonLoading = false;
    });

    builder.addCase(getMoreComments.pending, (state) => {
      state.loadingMore = true;
    });
    builder.addCase(getMoreComments.fulfilled, (state, action) => {
      state.loadingMore = false;
      if (action.payload?.success && action.payload.data.length === 0) {
        state.comments = [...state.comments, ...action.payload.data];
        state.page += 1;
      }
    });
    builder.addCase(getMoreComments.rejected, (state) => {
      state.loadingMore = false;
    });

    builder.addCase(likeComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(likeComment.fulfilled, (state, action) => {
      state.comments = state.comments.map((comment) => {
        if (comment._id === action.payload._id) {
          return action.payload.data;
        }
        return comment;
      });
    });
    builder.addCase(likeComment.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(dislikeComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(dislikeComment.fulfilled, (state, action) => {
      state.comments = state.comments.map((comment) => {
        if (comment._id === action.payload._id) {
          return action.payload.data;
        }
        return comment;
      });
    });
    builder.addCase(dislikeComment.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload._id
      );
    });
    builder.addCase(deleteComment.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default commentSlice.reducer;