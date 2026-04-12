import { Navigate } from "react-router";

export function AuthRedirect() {
  return (
    <>
      {" "}
      <Navigate to={"/finanzas"} />
    </>
  );
}
