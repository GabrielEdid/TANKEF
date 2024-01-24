import axios from "axios";
export let token = "";

const refreshAPI = async () => {
  try {
    const response = await axios.post(url, body);
    const token = response.data.token;
    setUser({
      ...user,
      userToken: token,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

export const APIGet = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response:", response.data);
    return response;
  } catch (error) {
    if (error.response.data === "You need to sign in before continuing.") {
      await refreshAPI();
      return APIGet(url);
    }
    console.error("Error:", error);
  }
};

export const APIPost = async (url, body) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response.data === "You need to sign in before continuing.") {
      await refreshAPI();
      return APIPost(url, body);
    }
    console.error("Error:", error);
  }
};
