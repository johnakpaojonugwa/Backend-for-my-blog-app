import User from "../models/user.model.js"

export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, username, email, bio } = req.body || {};
        const avatar = req.files?.avatar?.[0]?.path;
        
        const updates = {};
        if (fullname) updates.fullname = fullname;
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (bio) updates.bio = bio;
        if (avatar) updates.avatar = avatar;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates, 
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
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
