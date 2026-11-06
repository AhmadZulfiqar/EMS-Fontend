import axios from "axios";

export const getApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            return (
                error.response.data?.message ||
                error.response.data?.title ||
                `Server Error (${error.response.status}): Please try again.`
            );
        }
        if (error.request) {
            return "Network error. Please check your internet connection or backend server.";
        }
    }
    return error instanceof Error ? error.message : "An unexpected error occurred.";

}