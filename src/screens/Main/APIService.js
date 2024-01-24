import axios from "axios";
import React, { useContext } from "react";
import { UserContext } from "../../hooks/UserContext";

const refreshAPI = async () => {
  const { user, setUser } = useContext(UserContext);
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
  const { user, setUser } = useContext(UserContext);
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.userToken}`,
      },
    });
    console.log("Response:", response.data);
    return response; // Guardar los datos de las publicaciones en el estado
  } catch (error) {
    if (error === "You need to sign in before continuing.") {
      refreshAPI();
      APIGet(url);
    }
    console.error("Error:", error);
  }
};

export const APIPost = async ({ url, body }) => {
  const { user, setUser } = useContext(UserContext);
  try {
    const response = await axios.post(
      url,
      {
        headers: {
          Authorization: `Bearer ${user.userToken}`,
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
