import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../NoPage/NoPage.module.css";

const NoPage = () => {
    const navigate = useNavigate();

    return (
        <div className={style.container}>
            <h1 className={style.title}>Oops!</h1>
            <img
                src="https://img.freepik.com/free-vector/404-error-with-people-holding-numbers-concept-illustration_114360-1869.jpg"
                alt="404 Illustration"
                className={style.image}
            />
            <p className={style.subtitle}>404 - Page Not Found</p>
            <p className={style.message}>
                The page you are looking for might be removed or temporarily unavailable.
            </p>

            <button className={style.button} onClick={() => navigate("/")}>
                ⬅ Back to Home
            </button>
        </div>
    );
};

export default NoPage;
