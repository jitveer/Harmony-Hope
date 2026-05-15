const Donation = require('../models/Donation');


const submitDonation = async (req, res) => {

    const { amount } = req.body;
    const user_Id = req.user.userId;

    if (!amount || amount < 0) {
        return res.status(400).json({ message: "Invalid donation amount" });
    }

    try {
        const donation = new Donation({ user_Id, amount });
        await donation.save();
        res.status(201).json({ message: "Donation submitted successfully", donation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


const getUserDonations = async (req, res) => {
    const user_Id = req.user.userId;
    try {
        const donations = await Donation.find({ user_Id }).sort({ createAt: -1 });
        res.status(200).json({ donations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to fetch donations" });
    }

}


const getAllDonations = async (req, res) => {
    try {
        const donations = await donations.find().populate('user_Id', 'name email');
        res.status(200).json({ total: donations.length, donations });
    } catch (err) {
        console.error(error);
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




module.exports = { submitDonation, getUserDonations, getAllDonations , getDonationSummary };