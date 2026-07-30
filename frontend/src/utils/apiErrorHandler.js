// apiErrorHandler.js
export const handleApiError = (err) => {
  if (err?.response) {
    const status = err.response?.status;
    const data = err.response?.data ?? {};

    switch (status) {
      case 400:
        return {
          type: "validationError",
          success: false,
          message:
            data.message ?? data.msg ?? "Validation failed. Please check input data.",
        };
      case 401:
        return {
          type: "unauthorized",
          success: false,
          message: data.message ?? data.msg ?? "You are not authorized. Please log in.",
        };
      case 403:
        return {
          type: "forbidden",
          success: false,
          message:
            data.message ??
            data.msg ??
            "You don't have permission to access this resource.",
        };
      case 404:
        return {
          type: "notFound",
          success: false,
          message: data.message ?? data.msg ?? "Requested resource not found.",
        };
      case 500:
        return {
          type: data.type ?? "serverError",
          success: false,
          message:
            data.message ?? data.msg ?? "Internal server error. Please try again later.",
        };
      default:
        return {
          type: "unknownError",
          success: false,
          message:
            data.message ??
            data.msg ??
            `Unexpected error (status ${status}). Please try again.`,
        };
    }
  } else if (err.request) {
    return {
      success: false,
      type: "networkError",
      message: "Server did not respond. Please try again later.",
    };
  } else {
    return {
      type: "requestError",
      success: false,
      message: err.message ?? "Something went wrong in request setup.",
    };
  }
};
