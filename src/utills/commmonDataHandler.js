export function getErrorMessage(error) {
    return error.response.data.status_message;
}
export function getResultData(response) {
    return response.data.result;
}