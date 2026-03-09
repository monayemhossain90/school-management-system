import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getSummarySuccess,
    getFailed,
    getError
} from './feeSlice';

export const getAllFees = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeList/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message));
    }
}

export const getFeeSummary = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeSummary/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSummarySuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message));
    }
}
