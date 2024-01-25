import axios from "axios";
let token = "";

export const setToken = (newToken) => {
  token = newToken;
};

export const getToken = () => {
  return token;
};

const axiosInstance = axios.create({
  baseURL: "https://market-web-pr477-x6cn34axca-uc.a.run.app",
});

const refreshAPI = async () => {
  // Lógica para refrescar el token
};

const handleRequest = async (requestFunc) => {
  try {
    const response = await requestFunc();
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error:", error);
    if (
      error.response &&
      error.response.data === "You need to sign in before continuing."
    ) {
      await refreshAPI();
      // Opcionalmente, reintentar la solicitud original después de refrescar el token
      // return handleRequest(requestFunc);
    }
    return {
      data: null,
      error: error.response ? error.response.data : error.message,
    };
  }
};

export const APIGet = async (url) => {
  return handleRequest(() =>
    axiosInstance.get(url, { headers: { Authorization: `Bearer ${token}` } })
  );
};

export const APIPost = async (url, body) => {
  return handleRequest(() =>
    axiosInstance.post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export const APIDelete = async (url) => {
  return handleRequest(() =>
    axiosInstance.delete(url, { headers: { Authorization: `Bearer ${token}` } })
  );
};
