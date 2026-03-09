import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    feesList: [],
    feeSummary: null,
    loading: false,
    error: null,
    response: null,
};

const feeSlice = createSlice({
    name: 'fee',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.feesList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getSummarySuccess: (state, action) => {
            state.feeSummary = action.payload;
            state.loading = false;
            state.error = null;
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
    },
});

export const {
    getRequest,
    getSuccess,
    getSummarySuccess,
    getFailed,
    getError,
} = feeSlice.actions;

export const feeReducer = feeSlice.reducer;
