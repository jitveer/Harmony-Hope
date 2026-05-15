import React from "react";
import styles from "./PrivacyPolicy.module.css";

function PrivacyPolicy() {
  return (
    <main className={styles.container} role="main">
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Last updated: <strong>September 12, 2025</strong>
          </p>
        </header>

        <article className={styles.content}>
          <p>
            We built this platform to connect colleagues who want to give with
            colleagues who need help. Protecting your privacy is important to
            us. This Privacy Policy explains what information we collect, how we
            use it, and the choices you have.
          </p>

          <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
          <ul className={styles.list}>
            <li>
              <strong>Account info:</strong> name, company email, department,
              profile photo (optional).
            </li>
            <li>
              <strong>Authentication:</strong> hashed passwords or third-party
              auth tokens used for login.
            </li>
            <li>
              <strong>Donation & request data:</strong> amounts, payment
              method metadata, request descriptions, supporting documents you
              upload.
            </li>
            <li>
              <strong>Usage data:</strong> pages visited, device and browser
              information, and basic analytics to improve the service.
            </li>
            <li>
              <strong>Communications:</strong> messages you send through the
              platform and support requests.
            </li>
          </ul>

          <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
          <ul className={styles.list}>
            <li>To create and manage your account and profile.</li>
            <li>To process donations and distribute funds to approved requests.</li>
            <li>To verify requests and prevent fraud or misuse.</li>
            <li>To send transactional messages (receipts, notifications, status updates).</li>
            <li>To analyze and improve the platform’s functionality and security.</li>
          </ul>

          <h2 className={styles.sectionTitle}>3. Sharing & Disclosure</h2>
          <p>
            We do not sell your personal data. We may share information in
            limited cases:
          </p>
          <ul className={styles.list}>
            <li>With payment processors to complete transactions.</li>
            <li>With our internal review committee to evaluate support requests.</li>
            <li>When required by law, or to respond to legal process.</li>
            <li>With third-party service providers who process data on our behalf under contract.</li>
          </ul>

          <h2 className={styles.sectionTitle}>4. Data Security</h2>
          <p>
            We implement reasonable technical and organizational safeguards to
            protect your data. Examples: encrypted storage for sensitive fields,
            TLS for data in transit, and access controls. While we strive to
            protect your data, no system is 100% secure.
          </p>

          <h2 className={styles.sectionTitle}>5. Retention</h2>
          <p>
            We retain your account and transactional data as long as necessary
            to provide services, meet legal obligations, and resolve disputes.
            You can request deletion of your account—see “Your Rights” below.
          </p>

          <h2 className={styles.sectionTitle}>6. Your Rights</h2>
          <ul className={styles.list}>
            <li>Access: Request a copy of the personal data we hold about you.</li>
            <li>Correction: Ask us to correct inaccurate or incomplete information.</li>
            <li>Deletion: Request deletion of your account (subject to legal or operational retention needs).</li>
            <li>Withdraw consent: If you previously gave consent for a specific processing activity.</li>
          </ul>

          <h2 className={styles.sectionTitle}>7. Cookies & Tracking</h2>
          <p>
            We use cookies and similar technologies for authentication, security,
            and analytics. You can control cookie preferences in your browser;
            blocking cookies may affect functionality.
          </p>

          <h2 className={styles.sectionTitle}>8. Children</h2>
          <p>
            Our platform is intended for company employees and colleagues. We
            do not knowingly collect information from children under 13.
          </p>

          <h2 className={styles.sectionTitle}>9. International Transfers</h2>
          <p>
            If we transfer data outside your country (for example, to service
            providers), we take steps to ensure appropriate safeguards are in
            place consistent with applicable law.
          </p>

          <h2 className={styles.sectionTitle}>10. Contact & Requests</h2>
          <p>
            For privacy inquiries, data access/deletion requests, or to report a
            security issue, please contact our Privacy Team:
          </p>
          <p className={styles.contact}>
            <a href="mailto:privacy@ourplatform.example">privacy@ourplatform.example</a>
            <span className={styles.contactNote}> · Response within 5 business days</span>
          </p>

          <h2 className={styles.sectionTitle}>11. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. When we make material
            changes, we will post a prominent notice and update the “Last
            updated” date.
          </p>

          <footer className={styles.footerNote}>
            <small>
              By using the platform you agree to the collection and use of
              information described here. This notice is for informational
              purposes and does not create legal rights beyond our Terms of
              Service.
            </small>
          </footer>
        </article>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
