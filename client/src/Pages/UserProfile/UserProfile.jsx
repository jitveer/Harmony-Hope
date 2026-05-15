import { useState, useEffect } from 'react';
import style from './UserProfile.module.css';
import { useUserTokenValidation } from '../../Components/UserTokenVerification/UserTokenVerification';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState("src/assets/react.svg");
    const { isValidToken, userId, setIsValidToken, setUserId } = useUserTokenValidation();
    const navigator = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // SAVE DATA TO STATE
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //WHEN EDIT MODE ( UPDATE USER DATA )
    const toggleEditMode = async () => {
        if (editMode) {


            const { name, email, phone, password, confirmPassword } = formData;

            // ✅ password aur confirm password match check
            if (password !== confirmPassword) {
                alert("Password and Confirm Password do not match!");
                return;
            }

            // FORM VALIDATAION
            const nameRegex = /^[A-Za-z\s]{3,20}$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

            if (!nameRegex.test(name)) {
                alert("Name must be 3-20 letters only (no numbers or special chars)");
                return;
            }

            if (!passwordRegex.test(password)) {
                alert("Password must be 8–20 chars, with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.)");
                return;
            }



            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        password: password || undefined
                    })
                });

                if (!res.ok) {
                    console.error("Failed to update user profile");
                    return;
                }

                const updatedData = await res.json();
                alert("Profile Updated");
            } catch (err) {
                console.error("Error updating profile:", err);
            }
        }

        setEditMode(prev => !prev);
    };

    // FOR UPLOADING OR CHANGING NEW PROFILE IMAGE
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    // FETCHING USER DATA FOR DISPLAY ON PROFILE
    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.error("Failed to fetch user data");
                    return;
                }

                const data = await res.json();

                if (data.user) {
                    setFormData({
                        name: data.user.name || '',
                        email: data.user.email || '',
                        phone: data.user.phone || '',
                        password: '',
                        confirmPassword: ''
                    });
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };


        fetchUserData();
    }, [userId]);



    //IF TOKEN IN LOCAL STORAGE THEN GO TO THAT PAGE
    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                navigator('/user-profile');
            } else {
                navigator('/');
            }
        }

        checkToken();
    }, [])

    return (
        <div className={style["profile-container"]}>
            <div className={style["profile-card"]}>
                <div className={style["profile-heading"]}>
                    <h1>Profile</h1>
                </div>

                <div className={style["profile"]}>
                    <div className={style["user-img"]}>
                        <div className={style["user-image-preview"]}>
                            <img src={selectedImage} alt="Profile Preview" />
                        </div>
                        <div className={style["image-upload"]}>
                            <label className={style["upload-button"]}>
                                Upload here
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={style["user-details"]}>
                        <div className={style["user-name"]}>
                            <label>Name:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p>{formData.name}</p>
                            )}
                        </div>

                        <div className={style["user-name"]}>
                            <label>Email:</label>
                            {/* ✅ email editable nahi hoga */}
                            <p>{formData.email}</p>
                        </div>

                        <div className={style["user-name"]}>
                            <label>Phone:</label>
                            {/* ✅ phone editable nahi hoga */}
                            <p>{formData.phone}</p>
                        </div>

                        {editMode && (
                            <>
                                <div className={style["user-name"]}>
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className={style["user-name"]}>
                                    <label>Confirm Password:</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </>
                        )}

                        <div className={style["user-edit-profile"]}>
                            <button onClick={toggleEditMode}>
                                {editMode ? 'Save Profile' : 'EDIT Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
