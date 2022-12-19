import { useState } from "react";
import { API } from "../API/user";

export default function useLogin() {
  const [state, setState] = useState({
    error: null,
    loading: null,
  });
  const login = async (passportID, password) => {
    try {
      setState((st) => ({ ...st, loading: true }));
      const { data: user } = await API.post(
        `/users/login`,
        { passportID, password },
        { headers: { "Content-Type": "application/json" } }
      );

      return user;
    } catch (error) {
      setState((st) => ({ ...st, error: error.response.data }));
    } finally {
      setState((st) => ({ ...st, loading: false }));
    }
  };
  return { login, setState, ...state };
}
