import style from "./page.module.scss";
import UserSignup from "../forms/user/SignupUser";
export default function UserSignupPage() {
  return (
    <div className={style.page}>
      <UserSignup />
    </div>
  );
}
