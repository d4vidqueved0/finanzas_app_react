import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { SignIn } from "../components/SIgnIn";
import { SignUp } from "../components/SignUp";

export function AuthLayout() {
  const [isInSignIn, setInSignIn] = useState(true);

  const handleSwitchSign = () => {
    setInSignIn((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div
        className={`w-full flex items-center justify-center min-h-screen -mb-24 -mt-24`}
      >
        {isInSignIn ? (
          <SignIn handleSwitch={handleSwitchSign} />
        ) : (
          <SignUp handleSwitch={handleSwitchSign} />
        )}
      </div>
    </>
  );
}
