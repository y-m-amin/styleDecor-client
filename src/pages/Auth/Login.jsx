import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;

      await signInUser(email, password);
      toast.success("Login successful!");

      setTimeout(() => navigate(redirectTo, { replace: true }), 900);

      reset();
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success("Logged in with Google!");
      setTimeout(() => navigate(redirectTo, { replace: true }), 900);
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse gap-20">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-accent">Login now!</h1>
          <p className="py-6 max-w-md text-gray-600">
            Access your dashboard, manage bookings, and more.
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl w-full max-w-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-body space-y-3"
          >
            {/* Email */}
            <div>
              <label className="label font-semibold">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                {...register("email", { required: "Email required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-10"
                  {...register("password", { required: "Password required" })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              className="btn btn-accent w-full"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              className="btn btn-outline btn-secondary w-full"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>

            <p className="text-center text-sm mt-3">
              Not a user?{" "}
              <Link to="/register" className="link link-primary">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}
