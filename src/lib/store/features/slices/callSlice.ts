import { CallSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: CallSliceI = {
  call: {
    _id: "",
    user: {
      _id: "",
      username: "",
      fullName: "",
      avatar: "",
    },
    kind: "audio",
    type: "incoming",
    createdAt: "",
    duration: 0,
  },
  calls: [
    {
      _id: "abc",
      user: {
        _id: "blaise",
        username: "blaise",
        fullName: "Blaise Pascal",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png",
      },
      kind: "audio",
      type: "incoming",
      createdAt: "2024-07-27T18:49:11.342Z",
      duration: 1000,
    },
    {
      _id: "abcd",
      user: {
        _id: "bail",
        username: "baila",
        fullName: "Baila",
        avatar:
          "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1723483837/sociial/settings/r5pvoicvcxtyhjkgqk8y.png",
      },
      kind: "video",
      type: "incoming",
      createdAt: "2024-07-27T18:49:11.342Z",
      duration: 1000,
    },
  ],
  skeletonLoading: false,
  loading: false,
};

export const getCalls = createAsyncThunk("call/getCalls", async () => {
  const parsed = await fetch("/api/v1/calls");
  return parsed.json();
});

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCall: (state, action) => {
      state.call = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCalls.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getCalls.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.calls = action.payload.data;
        }
      })
      .addCase(getCalls.rejected, (state) => {
        state.skeletonLoading = false;
      });
  },
});

export const { setCall } = callSlice.actions;

export default callSlice.reducer;
