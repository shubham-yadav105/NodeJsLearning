const express = require('express');
const app = express();

app.use(express.json()); // for parsing application/json

// Register routes - like Route::apiResource('users', UserController::class) in laravel
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes); // like Route::prefix('users')

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

