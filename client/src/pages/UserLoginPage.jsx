import style from "./page.module.scss";
import LoginUser from "../forms/user/LoginUser";
export default function UserLoginPage() {
  return (
    <div className={style.page}>
      <LoginUser />
    </div>
  );
}
