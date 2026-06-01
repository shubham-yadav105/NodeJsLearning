// just like routes/api.php in laravel 

const express = require('express');
const router = express.Router();

const {getAllUsers, getUserById, createUser, deleteUser }
    = require('../controllers/userController'); // like use App\Http\Constrollers\UserController in laravel
   
    // Like Route::get('/users', [UserController::class, 'index'])
    router.get('/', getAllUsers);
    router.get('/:id', getUserById); // like Route::get('/users/{id}', [UserController::class, 'show'])
    router.post('/', createUser);
    router.delete('/:id', deleteUser); // like Route::delete('/users/{id}', [UserController::class, 'destroy'])

    module.exports = router; // like return $router->group() in laravel
    