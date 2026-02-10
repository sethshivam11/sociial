import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  submitted: false,
};

export const submitReport = createAsyncThunk(
  "report/submit",
  async ({
    title,
    description,
    kind,
    user,
    entityId,
    image,
  }: {
    title: string;
    description: string;
    user: string;
    kind:
      | "post"
      | "comment"
      | "user"
      | "chat"
      | "problem"
      | "story"
      | "confession";
    entityId?: string;
    image?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("kind", kind);
    formData.append("user", user);

    if (entityId) formData.append("entityId", entityId);
    if (image) formData.append("image", image);

    const parsed = await fetch("/api/v1/report/submit", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  },
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    resetForm: (state) => {
      state.submitted = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitReport.pending, (state) => {
      state.loading = true;
      state.submitted = false;
    });
    builder.addCase(submitReport.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.submitted = true;
      }
    });
    builder.addCase(submitReport.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { resetForm } = reportSlice.actions;

export default reportSlice.reducer;
