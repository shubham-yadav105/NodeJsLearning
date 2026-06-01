// Simulating a database call that sometimes fails

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 1) {
                resolve({ id: 1, name: 'John Doe', email: 'jonh@gmail.com' });
            }
            else {
                reject(new Error('User not found'));
            }
        }, 1000);
    });
}

// Try with a valid user

async function fetchValidUser() {
    try {
        console.log('Fetching user id 1....');
        const user = await getUser(1);
        console.log('User found:', user);
    }
    catch (error) {
        console.error('Error fetching user:', error.message);
    }
}

// Try with an invalid user 
async function fetchInvalidUser() {
    try {
        console.log('Fetching user id 2....');
        const user = await getUser(2);
        console.log('User found:', user);
    }
    catch (error) {
        console.log('Error fetching user:', error.message);
    }
}

async function main() {
   await fetchValidUser();
   await fetchInvalidUser();
}

main();

// fetchValidUser();
// fetchInvalidUser();



const express = require("express");
const app = express();

app.use(express.json());  //allows us to read JSON body (like $request->json() in laravel)

// Get route - like Route::get() in laravel
app.get('/', (req, res) => {
    const users = [
        { id:1, name: 'John Doe', email: 'john@gmail.com'},
        {id:2, name: 'Jane Doe', email: 'sara@gmail.com'},
    ];
    res.json(users); // like return response()->json($users) in laravel
}) 

// GET single user - like Route::get('/users/{id}', ...)
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id); // like $id in laravel route 
    const users = [
        { id:1, name: 'John Doe', email: 'john@gmail.com'},
        {id:2, name: 'Jane Doe', email: 'sara@gmail.com'},
        {id:3, name: 'Bob Smirt', email: 'bob@gmail.com'},
    ];

    const user = users.find(u => u.id === id);

    if(!user) {
        return res.status(404).json({ message: 'User not found' }); // like abort laravel
    }
    res.json(user);  // like return response()->json() in laravel

});

// Post route - like Route::post('/users', ....) in laravel
app.post('/users', (req, res) => {
    const { name, email} = req.body; // like $request->name in laravel 

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required"});
    }

    // pretend we saved to db
    const newUser = {id : 3, name, email};

    res.status(201).json(newUser); // like return response()-json($user, 201); in laravel 
});

// start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


