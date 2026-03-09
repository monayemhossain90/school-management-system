import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    updateSuccess
} from './complainSlice';

export const getAllComplains = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}List/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message));
    }
}

export const updateComplainStatus = (id, fields) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Complain/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(updateSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || error.message));
    }
}