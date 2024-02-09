import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

let token = "";

export const setToken = async (newToken) => {
  token = newToken;
  try {
    const userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
    await AsyncStorage.setItem(
      "userInfo",
      JSON.stringify({ ...userInfo, userToken: newToken })
    );
  } catch (error) {
    console.error("Error updating the token in AsyncStorage:", error);
  }
};

export const getToken = () => {
  return token;
};

const axiosInstance = axios.create({
  baseURL: "https://market-web-pr477-x6cn34axca-uc.a.run.app",
});

const refreshAPI = async () => {
  console.log("Refreshing token..." + getToken());
  try {
    const refreshToken = getToken(); // Replace with your actual refresh token
    const response = await axiosInstance.post("/api/v1/account/refresh_token", {
      token: refreshToken,
    });
    const newToken = response.data.token;
    await setToken(newToken); // Update the local token and save to AsyncStorage
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};

const handleRequest = async (requestFunc) => {
  try {
    const response = await requestFunc();
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error:", error);
    console.log("Error entero: " + error.response.data);
    if (
      error.response &&
      error.response.data === "You need to sign in before continuing."
    ) {
      await refreshAPI();
      return handleRequest(requestFunc);
    }
    return {
      data: null,
      error: error.response ? error.response.data : error.message,
    };
  }
};

export const APIGet = async (url) => {
  return handleRequest(() =>
    axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export const APIPost = async (url, body) => {
  return handleRequest(() =>
    axiosInstance.post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export const APIPut = async (url, body) => {
  return handleRequest(() =>
    axiosInstance.put(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export const APIDelete = async (url, body = null) => {
  return handleRequest(() =>
    axiosInstance.delete(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};
