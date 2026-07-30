import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }
    return cb(new Error("Resume must be a PDF."));
  }

  if (file.fieldname === "profileImage") {
    const imageTypes = ["image/jpeg", "image/png"];

    if (imageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Profile image must be JPG, JPEG, or PNG."));
  }

  cb(new Error("Invalid file field."));
};

export const upload = new multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
