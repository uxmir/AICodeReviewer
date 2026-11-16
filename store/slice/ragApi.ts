import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/errorcatch";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const syncRag=createAsyncThunk(
 "rag/create",
 async(payload:{repoId:string,owner:string,repoName:string},{rejectWithValue}) =>{
    try {
        const response = await api.post("/ragPipelineApi", payload);
      return { repoId: payload.repoId, data: response?.data };
    } catch (error:any) {
      return rejectWithValue(getErrorMessage(error))  
    }
 }  
)