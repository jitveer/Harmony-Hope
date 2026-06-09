// UserTokenVerification.js
import { createContext, useState, useEffect, useContext, useId } from "react";
import { jwtDecode } from "jwt-decode";

const TokenContext = createContext();

export const UserTokenVerification = ({ children }) => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [userId, setUserId] = useState(null);

    const verifyToken = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsValidToken(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/user/verify`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setIsValidToken(true);
                const decodedUser = jwtDecode(token);
                setUserId(decodedUser.userId);
                // console.log("User id = " + userId);
                // console.log("isValidToken" + isValidToken);

            } else {
                setIsValidToken(false);
            }
        } catch (error) {
            console.error("Token verification failed", error);
            setIsValidToken(false);
        }
    };

    // verify on first load
    useEffect(() => {
        verifyToken();
    }, [isValidToken, userId]);


    return (
        <TokenContext.Provider
            value={{ isValidToken, setIsValidToken, userId, setUserId }}
        >
            {children}
        </TokenContext.Provider>
    );
};

export const useUserTokenValidation = () => {
    return useContext(TokenContext);
};
