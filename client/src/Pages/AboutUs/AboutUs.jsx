import React, { useEffect } from "react";
import styles from "./AboutUs.module.css";

function AboutUs() {
  useEffect(() => {
    // Scroll-triggered fade-in animations
    const sections = document.querySelectorAll(`.${styles.fadeInSection}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <div className={styles.aboutWrapper}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} ${styles.fadeInSection}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.primaryText}>Harmony Hope</span>
          </h1>
          <p className={styles.heroSubtitle}>
            A platform where generosity meets need. Together, we create a culture of care, 
            compassion, and collective responsibility.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`${styles.missionSection} ${styles.fadeInSection}`}>
        <div className={styles.missionContainer}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.sectionDesc}>
            At Harmony Hope, we believe that no one should face life's challenges alone. 
            Our mission is to bring employees and well-wishers together to support colleagues 
            during medical emergencies, education needs, and family crises — turning 
            compassion into meaningful action.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className={`${styles.howItWorksSection} ${styles.fadeInSection}`}>
        <h2 className={styles.sectionTitle}>How We Work</h2>
        <div className={styles.howGrid}>
          <div className={styles.howCard}>
            <div className={styles.howIcon}><i className="ri-hand-heart-line"></i></div>
            <h3>Receive Requests</h3>
            <p>Anyone in need can submit a help request anytime with complete confidentiality.</p>
          </div>
          <div className={styles.howCard}>
            <div className={styles.howIcon}><i className="ri-group-line"></i></div>
            <h3>Review & Approve</h3>
            <p>Our internal committee reviews requests carefully and verifies genuine needs.</p>
          </div>
          <div className={styles.howCard}>
            <div className={styles.howIcon}><i className="ri-heart-2-fill"></i></div>
            <h3>Distribute Help</h3>
            <p>Once approved, funds are distributed fairly based on urgency and requirement.</p>
          </div>
          <div className={styles.howCard}>
            <div className={styles.howIcon}><i className="ri-user-shared-2-line"></i></div>
            <h3>Open for All</h3>
            <p>Not just employees — anyone willing to support our mission can donate.</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`${styles.valuesSection} ${styles.fadeInSection}`}>
        <h2 className={styles.sectionTitle}>Our Core Values</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}><i className="ri-heart-line"></i></div>
            <h3>Compassion</h3>
            <p>We lead with empathy and care for every individual’s well-being.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}><i className="ri-community-line"></i></div>
            <h3>Unity</h3>
            <p>We create a workplace culture that thrives on mutual support.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}><i className="ri-hand-coin-line"></i></div>
            <h3>Transparency</h3>
            <p>Every contribution and disbursement is recorded with clarity.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`${styles.teamSection} ${styles.fadeInSection}`}>
        <h2 className={styles.sectionTitle}>Meet Our Volunteer Committee</h2>
        <div className={styles.teamGrid}>
          <div className={styles.teamCard}>
            <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Priya Sharma" />
            <h4>Priya Sharma</h4>
            <p>Program Coordinator</p>
          </div>
          <div className={styles.teamCard}>
            <img src="https://randomuser.me/api/portraits/men/30.jpg" alt="Rajesh Patel" />
            <h4>Rajesh Patel</h4>
            <p>Donor Relations</p>
          </div>
          <div className={styles.teamCard}>
            <img src="https://randomuser.me/api/portraits/women/60.jpg" alt="Ananya Verma" />
            <h4>Ananya Verma</h4>
            <p>Community Outreach</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.ctaSection} ${styles.fadeInSection}`}>
        <h2 className={styles.ctaTitle}>Join the Movement</h2>
        <p className={styles.ctaDesc}>
          Whether you want to donate, volunteer, or simply spread awareness — 
          every action counts in building a supportive community.
        </p>
        <div className={styles.ctaBtnRow}>
          <button className={styles.ctaDonateBtn}><i className="ri-heart-fill"></i> Donate Now</button>
          <button className={styles.ctaLearnBtn}><i className="ri-question-line"></i> Learn More</button>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
