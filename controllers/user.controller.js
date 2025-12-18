import User from "../models/user.model.js"

export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
}

export const updateProfile = async (req, res) => {
    const { fullname, email } = req.body || {};
    const user = await User.findByIdAndUpdate(
        req.user.id,
        req.body, 
        { new: true }
    ).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
}

export const deleteProfile = async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
}




// import User from "../models/user.model.js";

// export const getProfile = async (req, res) => {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//     }
//     res.status(200).json({ success: true, user });
// }


// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, role } = req.body || {};
//         const updates = {};

//         // Users can always update these
//         if (fullname) updates.fullname = fullname;
//         if (email) updates.email = email;

//         // Only allow role update if user is admin
//         if (role) {
//             if (!req.user.isAdmin) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Not authorized to update role",
//                 });
//             }
//             updates.role = role;
//         }

//         const user = await User.findByIdAndUpdate(
//             req.user.id,
//             updates,
//             { new: true }
//         ).select("-password");

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Profile updated successfully",
//             user,
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server error", error: error.message });
//     }
// };
