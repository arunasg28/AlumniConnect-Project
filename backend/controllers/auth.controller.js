import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
	try {
		const { name, username, email, password , designation} = req.body;

		if (!name || !username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			name,
			email,
			password: hashedPassword,
			username,
			headline: designation || "",
		});

		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

		res.cookie("jwt-Mamcet", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "None", // prevent CSRF attacks,
			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
		});

		res.status(201).json({ message: "User registered successfully" });

		const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
	} catch (error) {
		console.log("Error in signup: ", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Create and send token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
		await res.cookie("jwt-Mamcet", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "None",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "Logged in successfully" });
	} 
	catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
  res.clearCookie("jwt-Mamcet", {
    httpOnly: true,                
    secure: process.env.NODE_ENV === "production", 
    sameSite: "None",              
    maxAge: 0,                     
  });

  // Send a response with a success message
  return res.status(200).json({ message: "Logged out successfully" });
};


export const getCurrentUser = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const { page = 1, limit = 10, search = "" } = req.query;

		const query = search
			? { $or: [{ name: new RegExp(search, "i") }, { username: new RegExp(search, "i") }] }
			: {};

		const users = await User.find(query)
			.select("-password")
			.skip((page - 1) * limit)
			.limit(parseInt(limit));

		const total = await User.countDocuments(query);

		res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
	} catch (error) {
		console.error("Error fetching all users:", error);
		res.status(500).json({ message: "Server error" });
	}
};
