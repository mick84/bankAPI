import { createContext, useContext, useEffect, useReducer } from "react";
const AuthContext = createContext();

export const USER = {
  LOGIN: "user log in",
  SIGNUP: "user sign up",
  LOGOUT: "user log out",
};
export const ACCOUNT = {
  LOGIN: "account log in",
  SIGNUP: "account sign up",
  LOGOUT: "account log out",
};
export const authReducer = (state, action) => {
  switch (action.type) {
    case USER.LOGIN:
      state.user = action.payload;
      break;
    case USER.SIGNUP:
      state.user = action.payload;
      break;
    case USER.LOGOUT:
      state.user = null;
      break;
    case ACCOUNT.LOGIN:
      state.account = action.payload;
      break;
    case ACCOUNT.SIGNUP:
      state.account = action.payload;
      break;
    case ACCOUNT.LOGOUT:
      state.account = null;
      break;
    default:
      throw new Error("Invalid action");
  }
  return state;
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    account: null,
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const account = JSON.parse(localStorage.getItem("account"));
    if (user) {
      dispatch({ type: USER.LOGIN, payload: user });
    }
    if (account) {
      dispatch({ type: ACCOUNT.LOGIN, payload: account });
    }
  }, []);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
