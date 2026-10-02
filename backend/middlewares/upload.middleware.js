import multer from "multer";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (_req, file, callback) => {
  const allowedExtension = /\.(jpe?g|png|webp)$/i.test(file.originalname);
  const allowedMimeType = allowedImageTypes.has(file.mimetype);
  const genericMimeWithImageExtension =
    file.mimetype === "application/octet-stream" && allowedExtension;

  if (!allowedMimeType && !genericMimeWithImageExtension) {
    return callback(new Error("Avatar must be a JPG, PNG, or WEBP image"));
  }

  callback(null, true);
},
});

export default upload;