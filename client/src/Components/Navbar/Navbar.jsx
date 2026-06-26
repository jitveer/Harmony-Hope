import { useEffect, useState, useContext } from "react";
import style from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserTokenValidation } from "../UserTokenVerification/UserTokenVerification";
import userImage from "/src/assets/user-profile.png";
import logo from "/src/assets/hormony_hope_charity_logo.png";
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";


/* ICONS */
import { FaHome, FaInfoCircle, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaBars, FaTachometerAlt, FaBell, FaPhoneAlt, FaDonate, FaClipboardList } from "react-icons/fa";


function Navbar() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const { isValidToken, userId, setIsValidToken, setUserId } = useUserTokenValidation();

    const navigate = useNavigate();


    // MOBILE MENU TOGGLE
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);



    //LOG OUT USER
    const logOut = async () => {
        localStorage.removeItem("token");
        setIsValidToken(false);
        setUserId(null);
        setUserName("");
        setIsAdmin(false);
        navigate("/");
    };

    //CAPATILIZE FIRST LETTER

    function capitalizeFirstWord(text) {
        if (!text) return "";
        const [firstWord, ...rest] = text.split(" ");
        return `${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)} ${rest.join(" ")}`;
    }



    //CHECK NOTIFICATION 
    const checkNotification = () => {
        if (isValidToken) {
            navigate("/notifications");
        } else {
            toast.info("Please Login First to see your notification.");
            navigate("/login");
        }
    }


    //CHECK USER PROFILE 
    const checkUserProfile = () => {
        if (isValidToken) {
            navigate("/user-profile", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            toast.info("Please Login First to see your notification.");
            navigate("/login");
        }
    }










    useEffect(() => {

        if (!userId) return;

        const fetchUserData = async () => {

            // console.log(userId, isValidToken);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!res.ok) {
                    console.error("Failed to fetch user data");
                    return;
                }

                const data = await res.json();
                setUserName(data.user.name);
                console.log(data.user.name);

            } catch (err) {
                console.error("Error fetching user Data");
            }

        }

        fetchUserData();

    }, [isValidToken, userId])


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && isValidToken) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.role === "admin" || decodedUser.role === "superadmin") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    }, [isValidToken]);


    return (
        <>

            {/*FOR NOTIFICATIO USIN TOAST LIBRARY*/}
            <ToastContainer />

            <nav className={style.navbar}>
                <div className={style["navbar-container"]}>
                    <div className={style["navbar-content"]}>
                        <Link to="/" className={style["navbar-brand"]} >
                            <img className={style["harmonyLogo"]} src={logo} alt="hormony_hope_charity_logo" />
                            <h1 className={style["navbar-logo"]}>Harmony Hope</h1>
                        </Link>

                        <div className={style["navbar-menu"]}>
                            <Link to="/" className={style["navbar-link"]}>Home</Link>
                            <Link to="/about_us" className={style["navbar-link"]}>About Us</Link>
                            <Link to="/contact_us" className={style["navbar-link"]}>Contact Us</Link>

                            {
                                isValidToken ? (
                                    isAdmin ? (
                                        <>
                                            <Link to="/admin-dashboard?tab=dashboard" className={style["navbar-link"]}>Dashboard</Link>
                                            <Link to="/admin-dashboard?tab=donations" className={style["navbar-link"]}>Donations</Link>
                                            <Link to="/admin-dashboard?tab=requests" className={style["navbar-link"]}>Requests</Link>
                                        </>
                                    ) : (
                                        <Link to="/user-dashboard" className={style["navbar-link"]}>Dashboard</Link>
                                    )
                                ) : (
                                    <>
                                        <Link to="/login" className={style["navbar-link"]}>Login</Link>
                                        <Link to="/register" className={style["navbar-link"]}>Register</Link>
                                    </>
                                )
                            }
                        </div>

                        <div className={style["navbar-actions"]}>
                            <div className="notification-bell">
                                <i className="ri-notification-line" onClick={checkNotification}>
                                </i>
                            </div>
                            {/* <div className={[ style["navbar-icon"] , style["navbar-profile-icon"] ].join(" ") }> */}
                            <div className={`${style["navbar-icon"]} ${style["navbar-profile-icon"]}`} onClick={checkUserProfile} >
                                {
                                    isValidToken ? (
                                        <div className={style["profile-icon-container"]} onClick={(e) => e.stopPropagation()}>
                                            <div onClick={checkUserProfile} className={style["profile-avatar-btn"]}>
                                                <i className="ri-user-line"></i>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); logOut(); }} className={style["logout-btn"]}>
                                                <FaSignOutAlt /> Log Out
                                            </button>
                                        </div>

                                    ) : (
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Link to="/"><i className="ri-user-line"></i></Link>
                                        </div>
                                    )
                                }
                            </div>

                            {/* Mobile menu button */}
                            <div className={style["navbar-mobile-menu"]}>
                                <button
                                    className={style["mobile-menu-button"]}
                                    onClick={toggleMobileMenu}
                                    aria-label="Toggle mobile menu"
                                >
                                    <FaBars className={style["mobile-menu-icon"]} />
                                    {/* <i className={`ri-menu-line ${style["mobile-menu-icon"]}`}></i> */}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* SIDEBAR */}


            {isMobileMenuOpen && (


                <div className={style["mobile-menu-backdrop"]} onClick={closeMobileMenu}>
                    <div className={style["mobile-menu-sidepanel"]} onClick={e => e.stopPropagation()} >

                        <button
                            className={style["mobile-menu-close"]}
                            onClick={closeMobileMenu}
                            aria-label="Close mobile menu"
                        >
                            <i className="ri-close-line"></i>
                        </button>

                        <div className={style["userView"]}>
                            <div className={style["userImg"]}>
                                <img src={userImage} alt="user_img" />
                            </div>
                            {
                                isValidToken ? (
                                    <>
                                        <div className={style["userNameSection"]}>
                                            <span className={style["userName"]}>{capitalizeFirstWord(userName)}</span>
                                            <span className={style["userdesignation"]}>{isAdmin ? "Admin" : "IT Engineer"}</span>
                                        </div>
                                    </>
                                ) : (<></>)
                            }
                        </div>

                        <nav className={style["mobile-menu-links"]}>
                            <div className={style["mobile-menu-list"]}>
                                <FaHome />
                                <Link to="/" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Home</Link>
                            </div>
                            {
                                isValidToken ? (
                                    isAdmin ? (
                                        <>
                                            <div className={style["mobile-menu-list"]}>
                                                <FaTachometerAlt />
                                                <Link to="/admin-dashboard?tab=dashboard" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Dashboard</Link>
                                            </div>
                                            <div className={style["mobile-menu-list"]}>
                                                <FaDonate />
                                                <Link to="/admin-dashboard?tab=donations" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Donations</Link>
                                            </div>
                                            <div className={style["mobile-menu-list"]}>
                                                <FaClipboardList />
                                                <Link to="/admin-dashboard?tab=requests" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Requests</Link>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={style["mobile-menu-list"]}>
                                            <FaTachometerAlt />
                                            <Link to="/user-dashboard" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Dashboard</Link>
                                        </div>
                                    )
                                ) : (<></>)
                            }
                            <div className={style["mobile-menu-list"]}>
                                <FaBell />
                                <Link to="/notifications" className={style["mobile-menu-link"]} onClick={() => { closeMobileMenu(), checkNotification() }}>Notifications</Link>
                            </div>
                            <div className={style["mobile-menu-list"]}>
                                <FaInfoCircle />
                                <Link to="/about_us" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>About Us</Link>
                            </div>
                            <div className={style["mobile-menu-list"]}>
                                <FaPhoneAlt />
                                <Link to="/contact_us" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Contact Us</Link>
                            </div>


                            {
                                isValidToken ? (
                                    <div className={style["mobile-menu-list"]}>
                                        <FaSignInAlt />
                                        <Link to="/login" className={style["mobile-menu-link"]} onClick={() => { closeMobileMenu(); logOut(); }} >Log Out</Link>
                                    </div>
                                ) : (
                                    <>
                                        <div className={style["mobile-menu-list"]}>
                                            <FaUserPlus />
                                            <Link to="/register" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Register</Link>
                                        </div>
                                        <div className={style["mobile-menu-list"]}>
                                            <FaSignOutAlt />
                                            <Link to="/login" className={style["mobile-menu-link"]} onClick={closeMobileMenu}>Log In</Link>
                                        </div>
                                    </>

                                )
                            }

                        </nav>
                    </div>
                </div>

            )}
        </>
    );
}

export default Navbar;
