export const getError = (error) => {
    return error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
}

export const BASE_URL = 'https://amazon-backend-d1vr.onrender.com';
