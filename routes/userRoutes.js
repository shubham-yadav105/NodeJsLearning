// just like routes/api.php in laravel 

const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");
const { createUserSchema, updateUserSchema } = require("../validators/userValidator");
const { getPostsByUser } = require("../controllers/postController");

const { getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    uploadAvatar,
    getAvatar
}
    = require('../controllers/userController'); // like use App\Http\Constrollers\UserController in laravel

// Like Route::get('/users', [UserController::class, 'index'])
router.use(authMiddleware); // like Route::middleware('auth:sanctum)
router.get('/', getAllUsers);
router.get('/:id', getUserById); // like Route::get('/users/{id}', [UserController::class, 'show'])
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser); // like Route::put('/users/{id}', [UserController::class, 'update]);
router.delete('/:id', deleteUser); // like Route::delete('/users/{id}', [UserController::class, 'destroy'])
router.get('/:id/posts', getPostsByUser);

router.post("/avatar", upload.single("avatar"), uploadAvatar);  // upload.single = one file
router.get("/avatar/:filename", getAvatar); // get the file 

module.exports = router; // like return $router->group() in laravel