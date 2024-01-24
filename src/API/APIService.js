import axios from "axios";
export let token = "";

const refreshAPI = async () => {};

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
      return error; //APIGet(url);
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
      return error; //APIPost(url, body);
    }
    console.error("Error:", error);
  }
};

export const APIDelete = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Deleted:", response.data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};
