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
    return response; // Guardar los datos de las publicaciones en el estado
  } catch (error) {
    if (error === "You need to sign in before continuing.") {
      refreshAPI(token);
      APIGet(url);
    }
    console.error("Error:", error);
  }
};

export const APIPost = async ({ url, body }) => {
  try {
    const response = await axios.post(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      body
    );
    return response;
  } catch (error) {
    if (error === "You need to sign in before continuing.") {
      refreshAPI();
      APIPost(url, body);
    }
    console.error("Error:", error);
  }
};
