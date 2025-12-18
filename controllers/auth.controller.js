import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    const { fullname, username, email, password } = req.body || {};
    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const avatar = req.files?.avatar?.[0]?.path || null;
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullname, username, email, password: hashed });

    res.status(201).json({ success: true, message: "User registered successfully", user });
}

export const login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, message: "Login successful", token });
}