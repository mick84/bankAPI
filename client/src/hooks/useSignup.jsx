import { useState } from "react";
import { API } from "../API/user";

export default function useSignup() {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });
  const signup = async ({
    firstname,
    lastname,
    email,
    passportID,
    password,
  }) => {
    try {
      setState((st) => ({ ...st, loading: true }));
      const { data: user } = await API.post(
        "/users",
        {
          firstname,
          lastname,
          email,
          passportID,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return user;
    } catch (error) {
      setState((st) => ({ ...st, error: error.response.data }));
    } finally {
      setState((st) => ({ ...st, loading: false }));
    }
  };

  return { signup, setState, ...state };
}
