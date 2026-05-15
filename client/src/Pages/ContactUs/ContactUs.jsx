import React, { useState } from "react";
import styles from "./ContactUs.module.css";
import { motion } from "framer-motion";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        honeypot: "", // bot protection field
    });

    const [status, setStatus] = useState(""); // success/error message

    // ✅ Validate Email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Bot Protection - if honeypot is filled, ignore
        if (formData.honeypot.trim() !== "") {
            console.warn("Bot detected! Form not submitted.");
            return;
        }

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus("❌ Please fill all fields.");
            return;
        }

        if (!isValidEmail(formData.email)) {
            setStatus("❌ Please enter a valid email address.");
            return;
        }

        try {
            setStatus("⏳ Sending...");
            const response = await fetch("https://your-backend-api.com/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            if (response.ok) {
                setStatus("✅ Message sent successfully!");
                setFormData({ name: "", email: "", message: "", honeypot: "" });
            } else {
                setStatus("❌ Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("❌ Network error. Please try again later.");
        }
    };

    return (
        <div className={styles.contactPage}>
            {/* HEADER */}
            <motion.h1
                className={styles.heading}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Contact Us
            </motion.h1>

            {/* CONTACT CONTAINER */}
            <div className={styles.container}>
                {/* LEFT: CONTACT INFO + MAP */}
                <motion.div
                    className={styles.leftSection}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h2>Our Address</h2>
                    <p>
                        4th D Cross Rd, HRBR Layout 2nd Block, HRBR Layout,
                        <br /> Kalyan Nagar, Bengaluru, Karnataka 560043
                    </p>
                    <p>
                        <strong>Phone:</strong>{" "}
                        <a href="tel:+918951006277">089510 06277</a>
                    </p>
                    <p>
                        <strong>Google Profile:</strong>{" "}
                        <a
                            href="https://share.google/39o9mSkEAvKHRKh0b"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on Google Maps
                        </a>
                    </p>

                    {/* GOOGLE MAP */}
                    <div className={styles.mapWrapper}>
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8917425073176!2d77.64175387408812!3d13.02109461325244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17057f1d4e61%3A0xf87e2b51d924dc21!2s4th%20D%20Cross%20Rd%2C%20HRBR%20Layout%202nd%20Block%2C%20HRBR%20Layout%2C%20Kalyan%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560043!5e0!3m2!1sen!2sin!4v1694510000000!5m2!1sen!2sin"
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                </motion.div>

                {/* RIGHT: CONTACT FORM */}
                <motion.div
                    className={styles.rightSection}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h2>Send Us a Message</h2>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            className={styles.input}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            className={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            className={styles.textarea}
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        {/* Hidden Honeypot Field for Bot Protection */}
                        <input
                            type="text"
                            name="honeypot"
                            value={formData.honeypot}
                            onChange={handleChange}
                            style={{ display: "none" }}
                        />

                        <button type="submit" className={styles.submitBtn}>
                            Send Message
                        </button>

                        {status && <p className={styles.statusMessage}>{status}</p>}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactUs;
