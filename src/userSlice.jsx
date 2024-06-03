import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const userSlice = createSlice({
  name: "user",
  initialState: Cookies.get("user") || null,
  reducers: {},
});

export const userReducer = userSlice.reducer;
