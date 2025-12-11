import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { name, email, password, photo } = data;

      const photoFile = photo?.[0] || null;

      await createUser({
        name,
        email,
        password,
        photoFile,
      });

      toast.success("Registration successful!", { autoClose: 1200 });

      setTimeout(() => {
        navigate("/");
      }, 1200);

      reset();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      toast.success("Registered with Google!", { autoClose: 1200 });

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast.error("Google authentication failed");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row gap-20">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-accent">Register Now!</h1>
          <p className="py-6 max-w-md text-gray-600">
            Create your account to book decoration services or become a decorator later.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-body space-y-3"
          >
            {/* Name */}
            <div>
              <label className="label font-semibold">Full Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label font-semibold">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Photo */}
            <div>
              <label className="label font-semibold">Profile Photo</label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                accept="image/*"
                {...register("photo")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="label font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-10"
                  {...register("password", {
                    required: "Password required",
                    minLength: {
                      value: 6,
                      message: "Must be at least 6 characters",
                    },
                    validate: {
                      upper: (v) =>
                        /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                      lower: (v) =>
                        /[a-z]/.test(v) || "Must contain at least one lowercase letter",
                    },
                  })}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={isSubmitting}
              className="btn btn-accent w-full"
              type="submit"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="btn btn-outline btn-secondary w-full"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>

            <p className="text-center text-sm mt-3">
              Already a user?{" "}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}
