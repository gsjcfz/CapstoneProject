document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const userCredentials = {
            name: username,
            password: password
        };

        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCredentials)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert(result.message);

                // Store the access token in local storage
                localStorage.setItem('accessToken', result.token);

            } else {
                alert('Error logging in. Please check your credentials.');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });
});
