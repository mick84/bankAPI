import { useState } from "react";
import { useAuth, USER } from "../../context/AuthContext";
import { changeInput } from "../../helpers";
import useLogin from "../../hooks/useLogin";
import style from "../form.module.scss";

export default function LoginUser() {
  const emptyInputs = {
    passportID: "",
    password: "",
  };
  const { dispatch } = useAuth();
  const [inputs, setInputs] = useState(emptyInputs);
  const { login, setState, error, loading } = useLogin();
  const clearInputs = () => setInputs(() => emptyInputs);
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const user = await login(inputs.passportID, inputs.password);
      if (user) {
        dispatch({ type: USER.LOGIN, payload: user });
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      setState((st) => ({ ...st, error: error.message }));
    }

    //clearInputs();
  };
  return loading ? (
    <p>Loading...</p>
  ) : (
    <form className={style.form} onReset={clearInputs} onSubmit={handleLogin}>
      <p className={style.title}>User Login</p>
      <hr />
      <div className={style["form-control"]}>
        <label htmlFor="passportID">Passport ID:</label>
        <input
          type="text"
          name="passportID"
          id="passportID"
          value={inputs.passportID}
          onChange={(e) => changeInput(e, setInputs)}
        />
      </div>
      <div className={style["form-control"]}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={inputs.password}
          onChange={(e) => changeInput(e, setInputs)}
        />
      </div>

      <div className={style.buttons}>
        <button type="reset">Clear</button>
        <button
          type="submit"
          disabled={!(inputs.passportID && inputs.password)}
        >
          Submit
        </button>
      </div>
      {error && <p className={style.errormessage}>{error}</p>}
    </form>
  );
}
