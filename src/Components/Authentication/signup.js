import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Global/header";
import SyncLoader from "react-spinners/SyncLoader";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Signup() {
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navDetails = {
        title: "Sign up",
    };

    const handleSubmit = (e) => {
        setIsLoading(true);
        axios
            .post(
                "http://localhost:5000/api/controller/signup",
                {
                    email: details.email,
                    password: details.password,
                    confirmPassword: details.confirmPassword,
                }
            )
            .then(function (response) {
                setIsLoading(false);
                navigate("/login", {
                    state: { message: "Successfully Signed Up" },
                });
            })
            .catch(function (error) {
                toast.error(error.response.data.err);
                console.log(error);
                setIsLoading(false);
            });
    };

    return (
        <>
            <Header data={navDetails} />
            <ToastContainer limit={1} />
            <div className="container">
                <div className="row pt-5">
                    <div className="col-md-6 col-10 mx-auto">
                        <div className="card mt-2 ms-lg-5 me-lg-5">
                            <div className="card-body">
                                <h4 className="card-title text-center">Sign Up</h4>
                                <div>
                                    <hr className="border border-dark border-2 w-75 mx-auto "></hr>
                                </div>
                                <div className="row">
                                    <div className="col-12 mx-auto mt-2">
                                        <form className="row g-2">
                                            <div className="col-12">
                                                <label
                                                    for="inputEmail4"
                                                    className="form-label"
                                                >
                                                    Email*
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={details.email}
                                                    onChange={(e) =>
                                                        setDetails({
                                                            ...details,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    id="inputEmail4"
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label
                                                    for="inputPassword4"
                                                    className="form-label"
                                                >
                                                    Password*
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    value={details.password}
                                                    onChange={(e) =>
                                                        setDetails({
                                                            ...details,
                                                            password:
                                                                e.target.value,
                                                        })
                                                    }
                                                    id="inputPassword4"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label
                                                    for="inputPassword4"
                                                    className="form-label"
                                                >
                                                    Confirm Password*
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="confirmPassword"
                                                    value={
                                                        details.confirmPassword
                                                    }
                                                    onChange={(e) =>
                                                        setDetails({
                                                            ...details,
                                                            confirmPassword:
                                                                e.target.value,
                                                        })
                                                    }
                                                    id="inputPassword4"
                                                />
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    className="btn btn-outline-primary w-75 mt-1"
                                                >
                                                    Sign Up
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
                                            <div className="d-flex justify-content-center">
                                                <span>
                                                    Already have an account?{" "}
                                                    <Link to="/login">
                                                        Login now
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

export default Signup;
