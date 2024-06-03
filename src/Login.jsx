import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required").email("Invalid email"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.message === "Login successful") {
          Cookies.set("user", data.user);
        }
        notify(data.message, "success");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },
  });

  const notify = (message, type) => {
    toast(message, {
      type: type,
      position: "top-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const { errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-700 to-slate-900 text-slate-100">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="login h-[24rem] w-[20rem] bg-slate-500 rounded-xl shadow-xl p-4">
              <h1 className="text-2xl font-medium text-slate-300 text-center mb-8 mt-4">
                LOGIN
              </h1>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="mt-4 p-2 w-full bg-slate-400 rounded-lg outline-none placeholder:text-slate-600 placeholder:font-thin text-slate-600"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formik.values.email}
              />
              {errors.email && touched.email ? (
                <h1 className="text-xs text-rose-500">{errors.email}</h1>
              ) : null}
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="mt-4 p-2 w-full bg-slate-400 rounded-lg outline-none placeholder:text-slate-600 placeholder:font-thin text-slate-600"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formik.values.password}
              />
              {errors.password && touched.password ? (
                <h1 className="text-xs text-rose-500">{errors.password}</h1>
              ) : null}
              <button
                type="submit"
                className="mt-4 p-2 w-full bg-slate-700 rounded-lg text-slate-100"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
