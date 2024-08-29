import { FollowSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: FollowSliceI = {
  _id: "",
  followings: [],
  followers: [],
  skeletonLoading: false,
  loading: false,
};

export const followUser = createAsyncThunk(
  "follow/followUser",
  async ({
    userId = "",
    username = "",
  }: {
    userId?: string;
    username?: string;
  }) => {
    const parsed = await fetch(
      `/api/v1/follow/new?${
        username ? `username=${username}` : `userId=${userId}`
      }`
    );
    return parsed.json();
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async ({
    userId = "",
    username = "",
  }: {
    userId?: string;
    username?: string;
  }) => {
    if (!userId && !username) return;
    const parsed = await fetch(
      `/api/v1/follow/unfollow?${
        username ? `username=${username}` : `userId=${userId}`
      }`
    );
    return parsed.json();
  }
);

export const getFollowers = createAsyncThunk(
  "follow/followers",
  async ({ userId, username }: { userId?: string; username?: string }) => {
    if (!userId && !username) return;
    const parsed = await fetch(
      `/api/v1/follow/followers?${
        username ? `username=${username}` : `userId=${userId}`
      }`
    );
    return parsed.json();
  }
);

export const getFollowings = createAsyncThunk(
  "follow/following",
  async ({ userId, username }: { userId?: string; username?: string }) => {
    if (!userId && !username) return;
    const parsed = await fetch(
      `/api/v1/follow/following?${
        username ? `username=${username}` : `userId=${userId}`
      }`
    );
    return parsed.json();
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.followings.push(action.payload.data.follow);
        }
      })
      .addCase(followUser.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (action.payload?.success) {
          const filteredFollowings = state.followings.filter(
            (user) =>
              user.username !== action.meta.arg.username &&
              user._id !== action.meta.arg.userId
          );
          state.followings = filteredFollowings;
        }
      })
      .addCase(unfollowUser.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getFollowers.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.followers = action.payload.data.followers.map(
            (user: { loading: boolean }) => ({
              ...user,
              loading: (user.loading = false),
            })
          );
        }
      })
      .addCase(getFollowers.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(getFollowings.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getFollowings.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.followings = action.payload.data.followings.map(
            (user: { loading: boolean }) => ({
              ...user,
              loading: (user.loading = false),
            })
          );
        }
      })
      .addCase(getFollowings.rejected, (state) => {
        state.skeletonLoading = false;
      });
  },
});

export default followSlice.reducer;
