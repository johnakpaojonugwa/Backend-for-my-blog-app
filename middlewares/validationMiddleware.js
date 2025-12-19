/**
 * Validation Middleware
 * Validates input fields for different routes
 */

export const validateRegister = (req, res, next) => {
    const { fullname, username, email, password } = req.body || {};
    
    const errors = [];
    
    if (!fullname || fullname.trim().length === 0) {
        errors.push("Full name is required");
    }
    if (!username || username.trim().length < 3) {
        errors.push("Username must be at least 3 characters");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Valid email is required");
    }
    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body || {};
    
    const errors = [];
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Valid email is required");
    }
    if (!password || password.length === 0) {
        errors.push("Password is required");
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    
    next();
};

export const validateCreatePost = (req, res, next) => {
    const { title, content } = req.body || {};
    
    const errors = [];
    
    if (!title || title.trim().length === 0) {
        errors.push("Title is required");
    }
    if (!content || content.trim().length === 0) {
        errors.push("Content is required");
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    
    next();
};

export const validateComment = (req, res, next) => {
    const { text } = req.body || {};
    
    if (!text || text.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Comment text is required" });
    }
    
    next();
};

export const validateUpdateProfile = (req, res, next) => {
    const { email, username, role } = req.body || {};
    
    const errors = [];
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Valid email is required");
    }
    if (username && username.trim().length < 3) {
        errors.push("Username must be at least 3 characters");
    }
    if (role && !['user', 'admin'].includes(role)) {
        errors.push("Role must be either 'user' or 'admin'");
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    
    next();
};
