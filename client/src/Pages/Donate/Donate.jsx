import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Donate.module.css';

const Donate = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [qrcode, setQrcode] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to donate.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_MY_DOMAIN_IP}/api/user/donate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: Number(amount) })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Donation submitted successfully!");
                navigate('/user-dashboard');
            } else {
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Donation Error:", err);
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <div className={styles["donation-container"]}>
                <div className={styles["donation-header"]}>
                    <h2>Your Donation Matters 🙏</h2>
                    <p>“No one has ever become poor by giving.”<br/>“Help today, hope for tomorrow.”</p>
                </div>
                <div className={styles["donation-card"]}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles["donation-amount"]}>
                            <label for="">Amount</label>
                            <input type="number" placeholder='100rs' value={amount} onChange={e => setAmount(e.target.value)} />
                        </div>
                        <div className={styles["submit-donation"]}>
                            <button type='submit'>Donate</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Donate;
