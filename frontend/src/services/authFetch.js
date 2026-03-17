import api from "./api";

export const authFetch = async (config) => {
    const token = localStorage.getItem("token");

    const headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : "",
    };

    return api({
        ...config,
        headers,
    });
};
