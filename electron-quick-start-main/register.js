document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const retypePassword = document.getElementById('reg-retype-password').value;

        if (password !== retypePassword) {
            alert('Passwords do not match!');
            return;
        }

        const user = {
            name: username,
            password: password,
            professor: false // You might want to change this based on your app's logic.
        };

        try {
            const response = await fetch('http://localhost:3000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
            } else {
                alert('Error registering user.');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });
});
