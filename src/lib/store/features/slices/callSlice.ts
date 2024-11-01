import { CallSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: CallSliceI = {
  call: {
    _id: "",
    callee: {
      _id: "",
      username: "",
      fullName: "",
      avatar: "",
    },
    caller: {
      _id: "",
      username: "",
      fullName: "",
      avatar: "",
    },
    type: "audio",
    startedAt: "",
    endedAt: "",
    createdAt: "",
  },
  calls: [],
  skeletonLoading: false,
  startingCall: false,
  endingCall: false,
  loading: false,
};

export const getCalls = createAsyncThunk("call/getCalls", async () => {
  const parsed = await fetch("/api/v1/calls");
  return parsed.json();
});

export const getCall = createAsyncThunk(
  "calls/getCall",
  async (callId: string) => {
    const parsed = await fetch(`/api/v1/calls/get/${callId}`);
    return parsed.json();
  }
);

export const startCall = createAsyncThunk(
  "calls/startCall",
  async (callData: { callee: string; type: "audio" | "video" }) => {
    const parsed = await fetch("/api/v1/calls/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callData),
    });
    return parsed.json();
  }
);

export const acceptCall = createAsyncThunk(
  "calls/acceptCall",
  async (callId: string) => {
    const parsed = await fetch(`/api/v1/calls/accept/${callId}`, {
      method: "PATCH",
    });
    return parsed.json();
  }
);

export const endCall = createAsyncThunk(
  "calls/endCall",
  async (callId: string) => {
    const parsed = await fetch(`/api/v1/calls/end/${callId}`, {
      method: "PATCH",
    });
    return parsed.json();
  }
);

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCall: (state, action) => {
      console.log(action.payload);
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
        if (
          action.payload?.success ||
          action.payload?.message === "No calls found"
        ) {
          state.calls = action.payload.data;
        }
      })
      .addCase(getCalls.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(getCall.pending, (state) => {
        state.loading = false;
      })
      .addCase(getCall.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.call = action.payload.data;
        }
      })
      .addCase(getCall.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(startCall.pending, (state) => {
        state.startingCall = true;
      })
      .addCase(startCall.fulfilled, (state, action) => {
        state.startingCall = false;
        if (action.payload?.success) {
          state.call = action.payload.data;
        }
      })
      .addCase(startCall.rejected, (state) => {
        state.startingCall = false;
      });

    builder
      .addCase(acceptCall.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptCall.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.call.endedAt = action.payload.data.startedAt;
        }
      })
      .addCase(acceptCall.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(endCall.pending, (state) => {
        state.endingCall = true;
      })
      .addCase(endCall.fulfilled, (state, action) => {
        state.endingCall = false;
        if (action.payload?.success) {
          state.call.endedAt = action.payload.data.endedAt;
        }
      })
      .addCase(endCall.rejected, (state) => {
        state.endingCall = false;
      });
  },
});

export const { setCall } = callSlice.actions;

export default callSlice.reducer;
