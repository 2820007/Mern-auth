import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req;  // Retrieve userId from the authenticated request object (from the middleware)

        // Validate the userId
        if (!userId) {
            return res.json({ success: false, message: "User ID is missing or invalid" });
        }

        // Find user in the database by userId
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Return user data
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            },
        });

    } catch (error) {
        // Catch any error and return a failure message
        res.json({ success: false, message: error.message });
    }
};
