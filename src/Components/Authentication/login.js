import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Header from "../Global/header";
import SyncLoader from "react-spinners/SyncLoader";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Login() {
    let navigate = useNavigate();

    let { state } = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const navDetails = {
        title: "Login",
    };

    let count = 1;
    useEffect(() => {
        if (state !== null && count === 1) {
            toast.success(state.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            count++;
        }
        let token = localStorage.getItem("token");

        if (token !== undefined && token !== null) {
            token = token.substring(7, token.length);

            var decoded = jwt_decode(token);

            var exp = decoded.exp * 1000;

            var lastDate = new Date(exp);

            let today = Date.now();
            if (today < lastDate) {
                navigate("/dashboard", {
                    state: { message: "Successfully logged in" },
                });
            }
        }
    }, []);

    const handleSubmit = () => {
        setIsLoading(true);
        axios
            .post(
                "https://east-economic-raccoon.glitch.me/api/controller/login",
                {
                    email: loginData.email,
                    password: loginData.password,
                }
            )
            .then(function (response) {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard", {
                    state: { message: "Successfully logged in" },
                });
                setIsLoading(false);
            })
            .catch(function (error) {
                toast.error(error.response.data.err, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                console.log(error);
                setIsLoading(false);
            });
    };

    return (
        <>
            <Header data={navDetails} />
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-10 mx-auto">
                        <div className="card mt-5">
                            <div className="card-body">
                                <h2 class="card-title text-center">Login</h2>
                                <div>
                                    <hr className="border border-dark border-2 w-75 mx-auto "></hr>
                                </div>
                                <div className="row">
                                    <div className="col-12 mt-3">
                                        <form className="row g-3">
                                            <div className="col-md-10 mx-auto">
                                                <label
                                                    for="inputEmail4"
                                                    className="form-label"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={loginData.email}
                                                    onChange={(e) =>
                                                        setLoginData({
                                                            ...loginData,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    id="inputEmail4"
                                                />
                                            </div>

                                            <div className="col-md-10 mx-auto">
                                                <label
                                                    for="inputPassword4"
                                                    className="form-label"
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    value={loginData.password}
                                                    onChange={(e) =>
                                                        setLoginData({
                                                            ...loginData,
                                                            password:
                                                                e.target.value,
                                                        })
                                                    }
                                                    id="inputPassword4"
                                                />
                                            </div>

                                            <div className="d-md-flex justify-content-md-center">
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    className="btn btn-outline-primary w-50 mt-3"
                                                >
                                                    Login
                                                </button>
                                            </div>
                                            {isLoading ? (
                                                    <div className="d-flex justify-content-center">
                                                        <SyncLoader
                                                            color={"#36d7b7"}
                                                            loading={true}
                                                            size={20}
                                                            aria-label="Loading Spinner"
                                                            data-testid="loader"
                                                        />
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            <div className="d-md-flex justify-content-md-center">
                                                <span>
                                                    Don't have an account?{" "}
                                                    <Link to="/signup">
                                                        Sign up now
                                                    </Link>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
