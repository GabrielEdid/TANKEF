import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAsyncStorage = ({ key, initialValue }) => {
  const [data, setData] = useState(initialValue);
  const [retrievedFromStorage, setRetrievedFromStorage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setData(JSON.parse(value));
        }
        setRetrievedFromStorage(true);
      } catch (error) {
        console.error(`useAsyncStorage getItem ${key} error:`, error);
      }
    };

    if (key) {
      fetchData();
    }
  }, [key]);

  const setNewData = async (value) => {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      setData(value);
    } catch (error) {
      console.error(`useAsyncStorage setItem ${key} error:`, error);
    }
  };

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setData(null);
    } catch (error) {
      console.error(`useAsyncStorage removeItem ${key} error:`, error);
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.clear();
      setData(null);
    } catch (error) {
      console.error(`useAsyncStorage clear error:`, error);
    }
  };

  return [data, setNewData, retrievedFromStorage, removeData, clearData];
};

export default useAsyncStorage;
