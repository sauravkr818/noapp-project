import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Header from "./Global/header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import SyncLoader from "react-spinners/SyncLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './style.css';

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    borderWidth: 3,
    borderRadius: 20,
    borderStyle: "dashed",
    content: "",
    border: "5px dashed #ccc7c7",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

function Dashboard() {
    let navigate = useNavigate();

    const [isToken, setIsToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);

    const [navDetails, setNavDetails] = useState({
        email: "",
        title: "Loading...",
    });

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                // // Do whatever you want with the file contents
                let token = localStorage.getItem("token");
                let email = "";
                if (token !== undefined && token !== null) {
                    token = token.substring(7, token.length);
                    var decoded = jwt_decode(token);
                    email = decoded.email;
                }
                setLoading(true);
                var formdata = new FormData();
                formdata.append("csvFile", file);
                formdata.append("email", email);

                var requestOptions = {
                    method: "POST",
                    url: "https://east-economic-raccoon.glitch.me/api/csvUpload/upload",
                    data: formdata,
                    redirect: "follow",
                };

                axios(requestOptions)
                    .then((response) => {
                        setLoadingTable(true);
                        axios
                            .post(
                                "https://east-economic-raccoon.glitch.me/api/controller/dashboard",
                                {
                                    email: decoded.email,
                                }
                            )
                            .then(function (response) {
                                setTableData([...response.data.data]);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        setLoadingTable(false);
                        toast.info(`File Uploaded Succesfully`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error(error.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    });

                setLoading(false);
            };
            reader.readAsArrayBuffer(file);
        });
    }, []);

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: { "text/csv": [] },
    });

    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    let count = 1;

    useEffect(() => {

        let token = localStorage.getItem("token");
        setIsToken(token);
        if (token !== undefined && token !== null) {
            token = token.substring(7, token.length);
            var decoded = jwt_decode(token);
            setNavDetails({
                ...navDetails,
                email: decoded.email,
                title: "Dashboard",
            });
            setLoadingTable(true);
            axios
                .post(
                    "https://east-economic-raccoon.glitch.me/api/controller/dashboard",
                    {
                        email: decoded.email,
                    }
                )
                .then(function (response) {
                    setTableData([...response.data.data]);
                })
                .catch(function (error) {
                    console.log(error);
                });

            setLoadingTable(false);

            var exp = decoded.exp * 1000;

            var lastDate = new Date(exp);

            let today = Date.now();
            if (today < lastDate) {
                if (count === 1) {
                    toast.success(`Logged In as ${decoded.email}`, {
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
            } else {
                navigate("/login");
            }
        } else if (token === null) {
            navigate("/login");
        }
    }, []);

    if (isToken !== undefined && isToken !== null) {
        return (
            <>
                <Header data={navDetails} />
                <ToastContainer />
                <div className="container mt-5">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-6 col-10 mb-5">
                            <label className="formbold-form-label formbold-form-label-2 ms-2">
                                Upload CSV File
                            </label>
                            <div {...getRootProps({ style })} className="hoverUpload">
                                <input {...getInputProps()} />
                                <p>
                                    Drag 'n' drop a csv files here, or click to
                                    select files
                                </p>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="">
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
                    <aside>
                        <h5 className="formbold-form-label formbold-form-label-2">Accepted files</h5>
                        <ul>{acceptedFileItems}</ul>
                    </aside>
                    <h4 className="mt-5 formbold-form-label formbold-form-label-2">Data: </h4>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">LinkedIn</th>
                                </tr>
                            </thead>
                            {loadingTable ? (
                                <div
                                    className="container d-flex justify-content-center align-items-center"
                                    style={{ minHeight: "90vh" }}
                                >
                                    <SyncLoader
                                        color={"#36d7b7"}
                                        loading={true}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                            ) : (
                                <tbody>
                                    {tableData &&
                                        tableData.map((val, i) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{i + 1}</th>
                                                    <td>{val.name}</td>
                                                    <td>{val.email}</td>
                                                    <td>{val.phone}</td>
                                                    <td>{val.linkedIn}</td>
                                                </tr>
                                            );
                                        })}
                                    {tableData.length === 0 ? (
                                        <div className="mt-5">
                                            No data found. Please upload a csv
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Header data={navDetails} />
                <ToastContainer />
                <div
                    className="container d-flex justify-content-center align-items-center"
                    style={{ minHeight: "90vh" }}
                >
                    <SyncLoader
                        color={"#36d7b7"}
                        loading={true}
                        size={20}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </>
        );
    }
}

export default Dashboard;
