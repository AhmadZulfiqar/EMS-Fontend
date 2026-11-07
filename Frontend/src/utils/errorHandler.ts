import axios from "axios";

export const getApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            debugger
            return (
                error.response.data?.message ||
                error.response.data?.title ||
                error.response.data?.error ||
                error.response.data?.details[0].description||
                `Server Error (${error.response.status}): Please try again.`
            );
        }
        if (error.request) {
            return "Network error. Please check your internet connection or backend server.";
        }
    }
    return error instanceof Error ? error.message : "An unexpected error occurred.";

}