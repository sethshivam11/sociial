import { FollowSliceI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: FollowSliceI = {
  _id: "",
  followings: [],
  followers: [],
  loading: false,
  skeletonLoading: false,
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
  "follow/followers",
  async () => {
    const parsed = await fetch("/api/v1/follow/followers");
    return parsed.json();
  }
);

export const getFollowings = createAsyncThunk(
  "follow/following",
  async () => {
    const parsed = await fetch("/api/v1/follow/following");
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
    });
    builder.addCase(followUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.followings.push(action.payload.data.follow);
      }
    });
    builder.addCase(followUser.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(unfollowUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.followings.push(action.payload.data.unfollow);
      }
    });
    builder.addCase(unfollowUser.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getFollowers.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(getFollowers.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload.success) {
        state.followers = action.payload.data.followers;
      }
    });
    builder.addCase(getFollowers.rejected, (state) => {
      state.skeletonLoading = false;
    });

    builder.addCase(getFollowings.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(getFollowings.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload.success) {
        state.followings = action.payload.data.followings;
      }
    });
    builder.addCase(getFollowings.rejected, (state) => {
      state.skeletonLoading = false;
    });
  },
});

export default followSlice.reducer;
