import { useState } from 'react';
import styles from './Request.module.css';
import { useNavigate } from 'react-router-dom';


const Request = () => {
    const [reqFormData, setReqFormData] = useState({
        amount: "",
        requestCategorie: "",
        daysToReturn: "",
        reasonForRequest: ""
    });
    
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReqFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to make a request.');
            return;
        }

        const requestData = {
            amount: reqFormData.amount,
            requestCategorie: reqFormData.requestCategorie,
            reasonForRequest: reqFormData.reasonForRequest,
            daysToReturn: reqFormData.daysToReturn
        };

        try {
            const res = await fetch('http://localhost:5000/api/requests/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Request sent successfully!');
                setReqFormData({
                    amount: "",
                    requestCategorie: "",
                    reasonForRequest: "",
                    daysToReturn: ""
                });
                alert("Registration Successful");
                navigate('/user-dashboard');
            } else {
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to send request.');
        }
    };

    return (
        <div className={styles["request-container"]}>
            <h1>Make a Support Request</h1>
            <div className={styles["request-card"]}>
                <form onSubmit={handleSubmit}>
                    <div className={styles["request-amount"]}>
                        <label>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={reqFormData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles["request-categories"]}>
                        <label>Request Categories</label>
                        <select
                            name="requestCategorie"
                            value={reqFormData.requestCategorie}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Medical">Medical</option>
                            <option value="Education">Education</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Food">Food</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className={styles["request-categories"]}>
                        <label>Days to return</label>
                        <select
                            name="daysToReturn"
                            value={reqFormData.daysToReturn}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="5">5 Days</option>
                            <option value="10">10 Days</option>
                            <option value="15">15 Days</option>
                            <option value="20">20 Days</option>
                            <option value="30">30 Days</option>
                        </select>
                    </div>

                    <div className={styles["request-reason"]}>
                        <label>Reason for request</label>
                        <textarea
                            name="reasonForRequest"
                            rows="5"
                            cols="30"
                            placeholder="Type your reason here..."
                            value={reqFormData.reasonForRequest}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className={styles["request-button"]}>
                        <button type="submit">Request</button>
                    </div>

                    {message && (
                        <p className={styles["request-message"]}>{message}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Request;
