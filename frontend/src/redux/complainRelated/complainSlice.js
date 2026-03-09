import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    complainsList: [],
    loading: false,
    error: null,
    response: null,
};

const complainSlice = createSlice({
    name: 'complain',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.complainsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateSuccess: (state, action) => {
            const updated = action.payload;
            state.complainsList = state.complainsList.map(c =>
                c._id === updated._id ? { ...c, ...updated } : c
            );
            state.loading = false;
            state.error = null;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    updateSuccess
} = complainSlice.actions;

export const complainReducer = complainSlice.reducer;