import { useState } from "react";
import { changeInput } from "../../helpers";
import { useAuth, USER } from "../../context/AuthContext";
import useSignup from "../../hooks/useSignup";
import style from "../form.module.scss";
export default function UserSignup() {
  const { dispatch } = useAuth();
  const emptyInputs = {
    firstname: "",
    lastname: "",
    passportID: "",
    email: "",
    password: "",
  };
  const [inputs, setInputs] = useState(emptyInputs);
  const { signup, error, loading, setState } = useSignup();
  const clearInputs = () => setInputs(() => emptyInputs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await signup(inputs);
      if (newUser) {
        dispatch({ type: USER.SIGNUP, payload: newUser });
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    } catch (error) {
      setState((st) => ({ ...st, error: error.message }));
    }
  };
  return loading ? (
    <p>Loading...</p>
  ) : (
    <form className={style.form} onReset={clearInputs} onSubmit={handleSubmit}>
      <p className={style.title}>Register a new user</p>
      <hr />
      <div className={style["form-control"]}>
        <label htmlFor="firstname">First name:</label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          pattern="[A-Z]{1}[a-z]{1,12}"
          value={inputs.firstname}
          onChange={(e) => changeInput(e, setInputs)}
        />
      </div>
      <div className={style["form-control"]}>
        <label htmlFor="lastname">Last Name:</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          pattern="[A-Z]{1}[a-z]{1,12}"
          value={inputs.lastname}
          onChange={(e) => changeInput(e, setInputs)}
        />
      </div>
      <div className={style["form-control"]}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={inputs.email}
          onChange={(e) => changeInput(e, setInputs)}
        />
      </div>
      <div className={style["form-control"]}>
        <label htmlFor="passportID">Passport ID</label>
        <input
          type="text"
          id="passportID"
          name="passportID"
          value={inputs.passportID}
          onChange={(e) => changeInput(e, setInputs)}
        />
      </div>
      <div className={style["form-control"]}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={inputs.password}
          onChange={(e) => changeInput(e, setInputs)}
        />
      </div>

      <div className={style.buttons}>
        <button type="reset">Clear</button>
        <button type="submit" disabled={inputs.password === ""}>
          Submit
        </button>
      </div>
      {error && <p className={style.errormessage}>{error}</p>}
    </form>
  );
}
