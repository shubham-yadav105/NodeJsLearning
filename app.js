const express = require('express');
const app = express();
require("dotenv").config(); // like Laravel auto-loading .env

app.use(express.json()); // for parsing application/json

// Register routes - like Route::apiResource('users', UserController::class) in laravel
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');


app.use('/users', userRoutes); // like Route::prefix('users')
app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

