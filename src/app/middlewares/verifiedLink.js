const jwt = require('jsonwebtoken');

// ...

// Assuming verificationToken is extracted from the request's query parameters
jwt.verify(verificationToken, 'thinhisme123', (err, decoded) => {
    if (err) {
        // Token is invalid or has expired
        console.error('Error verifying token:', err);
        // Handle the error, e.g., render an error page or show a message to the user
    } else {
        // Token is valid
        console.log('Token verified successfully:', decoded);
        // Mark the user account as verified in your database
        // Redirect the user to a success page or show a message indicating successful verification
    }
});