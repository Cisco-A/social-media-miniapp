import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
	const [scheme, token] = (req.headers.authorization ?? "").split(" ");

	if (scheme !== "Bearer" || !token) {
		return res.status(401).json({
			success: false,
			message: "Authentication required",
		});
	}

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		return next();
	} catch {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};

export default authenticate;