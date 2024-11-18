import { ConfessionSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: ConfessionSliceI = {
  messages: [],
  loading: false,
  skeletonLoading: false,
};

export const sendConfession = createAsyncThunk(
  "confession/send",
  async ({
    content,
    reciever,
    attachment,
  }: {
    content: string;
    reciever: string;
    attachment: File | null;
  }) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("reciever", reciever);
    if (attachment) {
      // check if the file is greater than 50MB
      if (attachment.size > 52428800) {
        return {
          success: false,
          message: "Invalid file size",
          data: null,
          statusCode: 400,
        };
      }
      formData.append("attachment", attachment);
    }
    const parsed = await fetch("/api/v1/confessions/send", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const getConfession = createAsyncThunk("confession/get", async () => {
  const parsed = await fetch("/api/v1/confessions/get");
  return parsed.json();
});

export const deleteConfession = createAsyncThunk(
  "confession/deleteConfession",
  async (messageId: string) => {
    const parsed = await fetch(`/api/v1/confessions/${messageId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

const confessionSlice = createSlice({
  name: "confession",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendConfession.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendConfession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = [...state.messages, action.payload.data];
        }
      })
      .addCase(sendConfession.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getConfession.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getConfession.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.messages = action.payload.data;
        }
      })
      .addCase(getConfession.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(deleteConfession.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteConfession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = state.messages.filter(
            (message) => message._id !== action.meta.arg
          );
        }
      })
      .addCase(deleteConfession.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default confessionSlice.reducer;
