/*import { createContext, useContext, useEffect, useReducer } from "react";
const AccountContext = createContext();
export const ACCOUNT = {
  LOGIN: "account log in",
  SIGNUP: "account sign up",
  LOGOUT: "account log out",
};
export const accountReducer = (state, action) => {
  switch (action.type) {
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

export const AccountContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, { account: null });
  useEffect(() => {
    const account = JSON.parse(localStorage.getItem("account"));
    if (account) {
      dispatch({ type: ACCOUNT.LOGIN, payload: account });
    }
  }, []);
  return (
    <AccountContext.Provider value={{ state, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
};
export const useAccount = () => useContext(AccountContext);
*/
