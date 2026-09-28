import User from "./users.schema";


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
      _id: {$ne: userId}
    });

    if (usernameExists) {
      throw new Error("Username already taken");
    }
  }

  user.username = data.username ?? user.username;
  user.displayName = data.displayName ?? user.displayName;
  user.bio = data.bio ?? user.bio;
  user.avatarUrl = data.avatarUrl ?? user.avatarUrl;

  return user.save();

};
