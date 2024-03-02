import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setAuthToken from "../setAuthToken";

const UserSlice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        user: [],
        error: "",
        login: false,
        token: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getUser.fulfilled, (state, action) => {
                localStorage.setItem("token", action.payload.token)
                state.token = action.payload.token
                state.login = true
            })
            .addCase(getUser.rejected, (state, action) => {

                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.login = true
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = action.null;
                state.login = false;
                state.token=null
            })
    },
});

export const getUser = createAsyncThunk("user/getUser", async (snd) => {
    try {
        const response = await axios({
            method: 'post',
            url: 'http://192.168.6.65:3000/api/user/get_user',
            data: snd
        });
        return response.data;

    } catch (error) {
        throw new Error(error.message);
    }
});

export const loadUser = createAsyncThunk("user/loadUser", async () => {
    try {
        setAuthToken(localStorage.getItem("token"))
        const response = await axios({
            method: 'post',
            url: 'http://192.168.6.65:3000/api/user/load_user',
        });
        return response.data;

    } catch (error) {
        throw new Error(error.message);
    }
});

export const logout = createAsyncThunk("user/logout", async () => {
    localStorage.clear();
    return null;
})




export default UserSlice.reducer;
