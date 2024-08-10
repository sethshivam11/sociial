import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  submitted: false,
};

export const createReport = createAsyncThunk(
  "reports/create",
  async ({
    title,
    description,
    type,
    user,
    entityId,
    image,
  }: {
    title: string;
    description: string;
    user: string;
    type: "post" | "comment" | "user" | "chat" | "problem" | "story";
    entityId?: string;
    image?: string;
  }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("user", user);

    if (entityId) formData.append("entityId", entityId);
    if (image) formData.append("image", image);

    const parsed = await fetch("/api/v1/report", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createReport.pending, (state) => {
      state.loading = true;
      state.submitted = false;
    });
    builder.addCase(createReport.fulfilled, (state) => {
      state.loading = false;
      state.submitted = true;
    });
    builder.addCase(createReport.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default reportSlice.reducer;
