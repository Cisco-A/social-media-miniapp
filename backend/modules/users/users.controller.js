import * as userService from "./users.service.js";

export const getUsers = async (req, res) => {
  try {
    const { search, page, limit } = req.query;

    const result = await userService.getUsers({ search, page, limit });

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    return res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const profileData = { ...req.body };

    if (req.file) {
      profileData.avatarUrl = await userService.uploadAvatar(req.file.buffer);
    }

    const user = await userService.updateProfile(
      req.user.userId,
      profileData,
    );

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
