import User from "./users.schema.js";

export const getUsers = async ({ search = "", page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {};

  if (search.trim()) {
    filter.$or = [
      {
        username: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        displayName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-passwordHash")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (data.username) {
    const usernameExists = await User.exists({
      username: data.username,
      _id: { $ne: userId },
    });

    if (usernameExists) {
      throw new Error("Username already taken");
    }
  }

  user.username = data.username ?? user.username;
  user.displayName = data.displayName ?? user.displayName;
  user.bio = data.bio ?? user.bio;
  user.avatarUrl = data.avatarUrl ?? user.avatarUrl;

  await user.save();

  return User.findById(userId).select("-passwordHash");
};
