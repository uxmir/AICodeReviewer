import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/errorcatch";
import { Review } from "@/types/review";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ReviewState {
  reviews: Review[];       // সব রিভিউ লিস্ট রাখার জন্য
  review: Review | null;   // সিঙ্গেল রিভিউ ডিটেইলস রাখার জন্য
  error: string | null;
  loading: boolean;
}

const initialState: ReviewState = {
  reviews: [],
  review: null,
  error: null,
  loading: false,
};

// Finding all reviews
export const findAllReview = createAsyncThunk(
  "review/all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/review");
      return response?.data?.data || response?.data; 
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Finding single review in details
export const findSingle = createAsyncThunk(
  "review/single",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/review/${id}`); 
      return response?.data?.data || response?.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearSingleReview: (state) => {
      state.review = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==========================================
      // 1. Find All Reviews Cases
      // ==========================================
      .addCase(findAllReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findAllReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(findAllReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ==========================================
      // 2. Find Single Review Cases
      // ==========================================
      .addCase(findSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload;
      })
      .addCase(findSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSingleReview } = reviewSlice.actions;
export default reviewSlice.reducer;