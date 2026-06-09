import React, { useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useUserTokenValidation } from "../../Components/UserTokenVerification/UserTokenVerification";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {

    const { isValidToken } = useUserTokenValidation();

    const navigator = useNavigate();

    function navigating() {
        if (isValidToken) {
            navigator('/donate');
        } else {
            toast.info("Please Login First to see your dashboard / donate.");
            navigator('/login');
        }
    }

    const handleRequestHelp = () => {
        if (isValidToken) {
            navigator('/request');
        } else {
            toast.info("Please Login First to request help.");
            navigator('/login');
        }
    };

    useEffect(() => {
        // Hero animations
        const counters = document.querySelectorAll('.donation-counter');

        const animateCounter = (counter, target) => {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = '₹2,45,000';
                    clearInterval(timer);
                } else {
                    counter.textContent = '₹' + Math.floor(current).toLocaleString();
                }
            }, 20);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target, 245000);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }, []);




    useEffect(() => {
        // Smooth scroll
        const scrollIndicator = document.querySelector('.animate-bounce')?.parentElement;

        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function () {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            });
        }
    }, []);


    useEffect(() => {
        // Button interactions
        const buttons = document.querySelectorAll('button');

        buttons.forEach(button => {
            button.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
            });
        });
    }, []);


    useEffect(() => {

    }, [])

    return (
        <>
            <div className={styles.bodyBg}>

                <section className={styles.heroSection}>
                    <div className={styles.heroBgImg}></div>
                    <div className={styles.heroOverlay}></div>
                    <div className={styles.floatingIcon1}>
                        <i className="ri-heart-line"></i>
                    </div>
                    <div className={styles.floatingIcon2}>
                        <i className="ri-hand-heart-line"></i>
                    </div>
                    <div className={styles.floatingIcon3}>
                        <i className="ri-coins-line"></i>
                    </div>
                    <div className={styles.heroContentWrapper}>
                        <div className={styles.heroGrid}>
                            <div className={styles.heroTextCol}>
                                <div className={styles.heroTextBlock}>
                                    <h1 className={styles.heroTitle}>
                                        Empowering Our <span className={styles.primaryText}>Community</span> Through Collective Care
                                    </h1>
                                    <p className={styles.heroSubtitle}>
                                        Join our internal donation platform where colleagues support colleagues. Together, we create a safety net that ensures no team member faces challenges alone.

                                    </p>
                                    <p className={styles.heroDesc}>
                                        From medical emergencies to educational support, our platform connects those who can give with those who need help, fostering a culture of compassion and unity.
                                    </p>
                                </div>
                                <div className={styles.heroBtnRow}>
                                    <button className={styles.donateBtn} onClick={navigating}>
                                        <div className={styles.btnIcon}><i className="ri-heart-fill"></i></div>
                                        Donate Now
                                    </button>
                                    <button className={styles.requestBtn} onClick={handleRequestHelp}>
                                        <div className={styles.btnIcon}><i className="ri-hand-heart-line"></i></div>
                                        Request Help
                                    </button>
                                </div>
                                <div className={styles.heroStatsRow}>
                                    <div className={styles.heroStatBox}>
                                        <div className={"donation-counter " + styles.heroStatValue}>₹2,45,000</div>
                                        <div className={styles.heroStatLabel}>Total Donated</div>
                                    </div>
                                    <div className={styles.heroStatBox}>
                                        <div className={styles.heroStatValue}>127</div>
                                        <div className={styles.heroStatLabel}>Families Helped</div>
                                    </div>
                                    <div className={styles.heroStatBox}>
                                        <div className={styles.heroStatValue}>89%</div>
                                        <div className={styles.heroStatLabel}>Participation Rate</div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className={styles.heroImgCol}>
                                <div className={styles.heroImgOverlay}></div>
                            </div> */}
                        </div>
                    </div>
                    <div className={styles.scrollIndicatorWrapper}>
                        <div className={styles.scrollIndicatorOuter}>
                            <div className={styles.scrollIndicatorInner}></div>
                        </div>
                    </div>
                </section>

                <section className={styles.howItWorksSection}>
                    <div className={styles.sectionContainer}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>How It Works</h2>
                            <p className={styles.sectionSubtitle}>
                                Our platform makes it simple to give and receive support within our company community
                            </p>
                        </div>
                        <div className={styles.howItWorksGrid}>
                            <div className={styles.howItWorksCard}>
                                <div className={styles.howItWorksIcon1}><i className="ri-user-add-line"></i></div>
                                <h3 className={styles.howItWorksCardTitle}>Create Request</h3>
                                <p className={styles.howItWorksCardDesc}>
                                    Submit your support request with details about your situation. All requests are reviewed with care and confidentiality.
                                </p>
                            </div>
                            <div className={styles.howItWorksCard}>
                                <div className={styles.howItWorksIcon2}><i className="ri-community-line"></i></div>
                                <h3 className={styles.howItWorksCardTitle}>Community Review</h3>
                                <p className={styles.howItWorksCardDesc}>
                                    Our volunteer committee reviews requests to ensure they meet our guidelines and determine the best way to provide support.
                                </p>
                            </div>
                            <div className={styles.howItWorksCard}>
                                <div className={styles.howItWorksIcon3}><i className="ri-heart-fill"></i></div>
                                <h3 className={styles.howItWorksCardTitle}>Receive Support</h3>
                                <p className={styles.howItWorksCardDesc}>
                                    Approved requests are shared with the community, and colleagues can contribute directly to help their team members.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>



                <section className={styles.supportCategoriesSection}>
                    <div className={styles.sectionContainer}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Support Categories</h2>
                            <p className={styles.sectionSubtitle}>
                                We provide assistance across various life situations that our colleagues may face
                            </p>
                        </div>
                        <div className={styles.supportCategoriesGrid}>
                            <div className={styles.supportCategory1}>
                                <div className={styles.supportCategoryIcon1}><i className="ri-hospital-line"></i></div>
                                <h3 className={styles.supportCategoryTitle}>Medical Emergency</h3>
                                <p className={styles.supportCategoryDesc}>
                                    Support for unexpected medical expenses and treatments
                                </p>
                                <div className={styles.supportCategoryStat1}>23 Active Cases</div>
                            </div>
                            <div className={styles.supportCategory2}>
                                <div className={styles.supportCategoryIcon2}><i className="ri-graduation-cap-line"></i></div>
                                <h3 className={styles.supportCategoryTitle}>Education Support</h3>
                                <p className={styles.supportCategoryDesc}>
                                    Helping with children's education and skill development
                                </p>
                                <div className={styles.supportCategoryStat2}>15 Active Cases</div>
                            </div>
                            <div className={styles.supportCategory3}>
                                <div className={styles.supportCategoryIcon3}><i className="ri-home-heart-line"></i></div>
                                <h3 className={styles.supportCategoryTitle}>Family Crisis</h3>
                                <p className={styles.supportCategoryDesc}>
                                    Support during family emergencies and difficult times
                                </p>
                                <div className={styles.supportCategoryStat3}>8 Active Cases</div>
                            </div>
                            <div className={styles.supportCategory4}>
                                <div className={styles.supportCategoryIcon4}><i className="ri-hand-heart-line"></i></div>
                                <h3 className={styles.supportCategoryTitle}>General Support</h3>
                                <p className={styles.supportCategoryDesc}>
                                    Other situations where community support makes a difference
                                </p>
                                <div className={styles.supportCategoryStat4}>12 Active Cases</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.ctaSection}>
                    <div className={styles.ctaContainer}>
                        <h2 className={styles.ctaTitle}>Ready to Make a Difference?</h2>
                        <p className={styles.ctaDesc}>
                            Join thousands of colleagues who believe in the power of community support. Every contribution, no matter the size, creates ripples of positive change.
                        </p>
                        <div className={styles.ctaBtnRow}>
                            <button className={styles.ctaDonateBtn} onClick={navigating}>
                                <div className={styles.btnIcon}><i className="ri-heart-fill"></i></div>
                                Start Donating
                            </button>
                            <button className={styles.ctaLearnBtn}>
                                <div className={styles.btnIcon}><i className="ri-question-line"></i></div>
                                Learn More
                            </button>
                        </div>
                        <div className={styles.ctaStatsGrid}>
                            <div>
                                <div className={styles.ctaStatValue}>₹12.5L</div>
                                <div className={styles.ctaStatLabel}>Total Impact</div>
                            </div>
                            <div>
                                <div className={styles.ctaStatValue}>340+</div>
                                <div className={styles.ctaStatLabel}>Active Donors</div>
                            </div>
                            <div>
                                <div className={styles.ctaStatValue}>95%</div>
                                <div className={styles.ctaStatLabel}>Success Rate</div>
                            </div>
                            <div>
                                <div className={styles.ctaStatValue}>24h</div>
                                <div className={styles.ctaStatLabel}>Avg Response</div>
                            </div>
                        </div>
                    </div>
                </section>
                <ToastContainer />
            </div>
        </>
    )
}

export default Home;
