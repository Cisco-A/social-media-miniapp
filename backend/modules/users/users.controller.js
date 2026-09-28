import * as userService from "./users.service";

export const getUser = async (req, res) => {
    try {
        const user = userService.getUserById(req.params.id);

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = userService.updateProfile(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}