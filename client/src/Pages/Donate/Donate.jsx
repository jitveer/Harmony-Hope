import { useState } from 'react';
import styles from './Donate.module.css';
import QrCode from 'react-qr-code';

const Donate = () => {

    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [qrcode, setQrcode] = useState(null);

    const [error, setError] = useState(null);





    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        
        
        try {
            
        } catch (error) {
            
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
