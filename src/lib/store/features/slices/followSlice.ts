import { FollowSliceI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: FollowSliceI = {
  _id: "",
  followings: [],
  followers: [],
  maxFollowers: 0,
  maxFollowings: 0,
  loading: false,
  loadingMore: false,
  isError: false,
  page: 1,
};

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/follow/new/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return parsed.json();
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/follow/unfollow/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return parsed.json();
  }
);

export const getFollowers = createAsyncThunk(
  "follow/getFollowers",
  async () => {
    const parsed = await fetch("/api/v1/follow/getFollowers");
    return parsed.json();
  }
);

export const getMoreFollowers = createAsyncThunk(
  "follow/getMoreFollowers",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/follow/getMoreFollowers?page=${page}`);
    return parsed.json();
  }
);

export const getFollowings = createAsyncThunk(
  "follow/getFollowings",
  async () => {
    const parsed = await fetch("/api/v1/follow/getFollowings");
    return parsed.json();
  }
);

export const getMoreFollowings = createAsyncThunk(
  "follow/getMoreFollowings",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/follow/getMoreFollowings?page=${page}`);
    return parsed.json();
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(followUser.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(followUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      if (action.payload.success) {
        state.followings.push(action.payload.data.follow);
      }
    });
    builder.addCase(followUser.rejected, (state) => {
      state.loading = false;
      state.isError = true;
    });

    builder.addCase(unfollowUser.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      if (action.payload.success) {
        state.followings.push(action.payload.data.unfollow);
      }
    });
    builder.addCase(unfollowUser.rejected, (state) => {
      state.loading = false;
      state.isError = true;
    });

    builder.addCase(getFollowers.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(getFollowers.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      if (action.payload.success) {
        state.followers = action.payload.data.followers;
        state.maxFollowers = action.payload.data.max;
      }
    });
    builder.addCase(getFollowers.rejected, (state) => {
      state.loading = false;
      state.isError = true;
    });

    builder.addCase(getFollowings.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(getFollowings.fulfilled, (state, action) => {
      state.loading = false;
      state.isError = false;
      if (action.payload.success) {
        state.followings = action.payload.data.followings;
        state.maxFollowings = action.payload.data.max;
      }
    });
    builder.addCase(getFollowings.rejected, (state) => {
      state.loading = false;
      state.isError = true;
    });

    builder.addCase(getMoreFollowers.pending, (state) => {
      state.loadingMore = true;
      state.isError = false;
    });
    builder.addCase(getMoreFollowers.fulfilled, (state, action) => {
      state.loadingMore = false;
      state.isError = false;
      if (action.payload.success) {
        state.followers = [
          ...state.followers,
          ...action.payload.data.followers,
        ];
      }
    });
    builder.addCase(getMoreFollowers.rejected, (state) => {
      state.loadingMore = false;
      state.isError = true;
    });

    builder.addCase(getMoreFollowings.pending, (state) => {
      state.loadingMore = true;
      state.isError = false;
    });
    builder.addCase(getMoreFollowings.fulfilled, (state, action) => {
      state.loadingMore = false;
      state.isError = false;
      if (action.payload.success) {
        state.followings = [
          ...state.followings,
          ...action.payload.data.followings,
        ];
      }
    });
    builder.addCase(getMoreFollowings.rejected, (state) => {
      state.loadingMore = false;
      state.isError = true;
    });
  },
});

export default followSlice.reducer;
