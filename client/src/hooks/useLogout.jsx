import { useAuth, USER } from "../context/AuthContext";
export default function useLogout(from) {
  const { dispatch } = useAuth();
  const logout = () => {
    dispatch({ type: USER.LOGOUT });
    localStorage.removeItem("user");
  };
  return logout;
}
