const Donation = require('../models/Donation');


const submitDonation = async (req, res) => {

    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount < 0) {
        return res.status(400).json({ message: "Invalid donation amount" });
    }

    try {
        const transactionId = "txn_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
        const donation = new Donation({
            userId,
            amount,
            transactionId,
            status: 'success'
        });
        await donation.save();
        res.status(201).json({ message: "Donation submitted successfully", donation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


const getUserDonations = async (req, res) => {
    const userId = req.user.userId;
    try {
        const donations = await Donation.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ donations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch donations" });
    }

}


const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate('userId', 'name email');
        res.status(200).json({ total: donations.length, donations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching donations" });
    }
}


const getDonationSummary = async (req, res) => {
    try {
        const donations = await Donation.find({});
        const totalDonations = donations.reduce((acc, curr) => acc + curr.amount, 0);
        const donationCount = donations.length;

        res.status(200).json({ totalDonations, donationCount });
    } catch (error) {
        console.error("Error in summary:", error);
        res.status(500).json({ message: "Server error" });
    }
}




module.exports = { submitDonation, getUserDonations, getAllDonations, getDonationSummary };