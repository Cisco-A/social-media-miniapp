import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Authentication required",
    });
  }

  const token = authorization.split("")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.userId) {
      return res.status(401).json({
        status: false,
        message: "Invalid authentication token",
      });
    }

    req.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

export default authenticate;
