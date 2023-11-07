const userSchema = ({
    username: {
        type: String,
        minLength: 10,
        maxLength: 25,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 75,
        trim: true
    },
})

// Podemos comprobar si le podemos meter timestamps al schema 