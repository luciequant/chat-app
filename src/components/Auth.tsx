import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";

type AuthType = "login" | "signup";

interface AuthFormData {
  email: string;
  password: string;
}

function Auth() {
  const [authType, setAuthType] = useState<AuthType>("signup");
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    setAuthErrorMessage(null);

    if (authType === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) setAuthErrorMessage(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setAuthErrorMessage(error.message);
      } else {
        alert("Sign up successful! Please check your email for confirmation");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{authType === "login" ? "Login" : "SignUp"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Emai:</label>
        <input
          type="email"
          {...register("email", { required: "Email is required." })}
        ></input>
        {errors.email && <p className="error-text">{errors.email.message}</p>}

        <label>Password:</label>
        <input
          type="password"
          {...register("password", { required: "Password is required." })}
        ></input>
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}

        {authErrorMessage && <p className="error-text">{authErrorMessage}</p>}

        <button type="submit">
          {authType === "login" ? "Login" : "SignUp"}
        </button>
      </form>
      <div>
        {authType === "login" ? (
          <p>
            Don't have an account?{" "}
            <button onClick={() => setAuthType("signup")}>Sign Up</button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setAuthType("login")}>Login</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
