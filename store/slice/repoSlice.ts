import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/errorcatch";
import { Repo } from "@/types/repo";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface repoState {
  repos: Repo | null;
  loading: boolean;
  error: string | null;
}

const initialState: repoState = {
  repos: null,
  loading: false,
  error: null,
};

export const findRepos = createAsyncThunk(
  "repo/find",
  async (
    params: {
      installationId: string | number;
      page: string | number;
      limit: string | number;
    } | null,
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/repos", { params: params });
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findRepos.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.repos = action.payload.data;
      })
      .addCase(findRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default repoSlice.reducer;
