import { Helmet } from "react-helmet-async";
import { Login } from "../components/Login";

export function AuthLayout() {
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className={`w-full flex items-center justify-center min-h-screen -mb-24 -mt-24`}>
        <Login />
      </div>
    </>
  );
}
