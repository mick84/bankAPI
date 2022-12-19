import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";
import style from "./navbar.module.scss";
export default function Navbar() {
  const { state } = useAuth();
  const logout = useLogout();
  return (
    <nav className={style.nav}>
      <ul className={style.navbar}>
        <NavLink className={style.navlink} to={"/"}>
          Home
        </NavLink>
        <NavLink className={style.navlink} to={"/about"}>
          About
        </NavLink>
      </ul>
      {state.user && (
        <>
          <h4>
            <span>{state.user.lastname}</span>&nbsp;
            <span>{state.user.firstname}</span>
          </h4>
          <p>
            <button onClick={logout}>Log out</button>
          </p>
        </>
      )}
      {!state.user && (
        <ul className={style["user-access"]}>
          <NavLink
            className={style.navlink}
            to={"/signup-user"}
            hidden={state.user}
          >
            User Sign up
          </NavLink>
          <NavLink
            className={style.navlink}
            to={"/login-user"}
            hidden={state.user}
          >
            User Log in
          </NavLink>
        </ul>
      )}
    </nav>
  );
}
