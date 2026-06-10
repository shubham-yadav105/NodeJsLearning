const multer = require("multer");
const path = require("path");

// Storage config - like Laravel's disk config
const storage = multer.diskStorage({

    // Where to save the file - like 'public/avatars' in Laravel
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    // What to name the file - like hashName() in Laravel
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname); // gets .jpg, .png etc
        cb(null, uniqueName + extension);
    }
});

// File filter - only allow images - like Laravel's mimes:jpg,png
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // accept file
    } else {
        cb(new Error("Only image files are allowed!"), false); // reject file
    }
};

// Size limit - like Laravel's max:2048
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB max
    }
});

module.exports = upload;