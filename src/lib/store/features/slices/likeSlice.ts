import { LikeSliceI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LikeSliceI = {
  loading: false,
  likes: [],
};

export const getLikes = createAsyncThunk("like/get", async (postId: string) => {
  const parsed = await fetch(`/api/v1/likes/${postId}`);
  return parsed.json();
});

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLikes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLikes.fulfilled, (state, action) => {
      state.loading = false;
      state.likes = action.payload.data;
    });
    builder.addCase(getLikes.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default likeSlice.reducer;