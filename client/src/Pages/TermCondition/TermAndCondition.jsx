import React from "react";
import styles from "./TermsAndConditions.module.css";

function TermsAndConditions() {
    return (
        <div className={styles.termsContainer}>
            <div className={styles.termsCard}>
                <h1 className={styles.termsTitle}>Terms & Conditions</h1>
                <p className={styles.termsIntro}>
                    Welcome to our internal donation and support platform. By using this
                    website, registering an account, or making a donation/request, you
                    agree to the following terms and conditions.
                </p>

                <div className={styles.termsSection}>
                    <h2 className={styles.sectionHeading}>1. Purpose</h2>
                    <p>
                        This platform is designed to connect colleagues who wish to donate
                        with those in need of support. It is strictly for charitable use
                        within our organization.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2 className={styles.sectionHeading}>2. User Responsibilities</h2>
                    <ul>
                        <li>You must provide accurate and honest information.</li>
                        <li>
                            Donations are voluntary and non-refundable once processed.
                        </li>
                        <li>
                            Requests for support must be genuine and supported with
                            appropriate details.
                        </li>
                    </ul>
                </div>

                <div className={styles.termsSection}>
                    <h2 className={styles.sectionHeading}>3. Confidentiality</h2>
                    <p>
                        All donation requests are treated with confidentiality. Sensitive
                        information shared will not be disclosed outside of the review
                        process.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2 className={styles.sectionHeading}>4. Misuse of Platform</h2>
                    <p>
                        Any misuse, including false requests or fraudulent activities, may
                        lead to account suspension and disciplinary actions as per company
                        policy.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2 className={styles.sectionHeading}>5. Agreement</h2>
                    <p>
                        By continuing to use this platform, you acknowledge that you have
                        read, understood, and agree to these Terms & Conditions.
                    </p>
                </div>

                <p className={styles.footerNote}>
                    Thank you for helping us build a culture of care and compassion within
                    our community.
                </p>
            </div>
        </div>
    );
}

export default TermsAndConditions;
