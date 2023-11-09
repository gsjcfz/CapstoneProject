document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const retypePassword = document.getElementById('reg-retype-password').value;
        const isProfessor = document.getElementById('professor-checkbox').checked;

        if (password !== retypePassword) {
            await window.myAPI.invoke('show-message-box', {
                type: 'error',
                title: 'Registration Error',
                message: 'Passwords do not match!'
            });
            return;
        }

        const user = {
            name: username,
            password: password,
            professor: isProfessor 
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
                await window.myAPI.invoke('show-message-box', {
                    type: 'info',
                    title: 'Registration Success',
                    message: result.message
                });
                window.myAPI.send('navigate', 'main');
            } else {
                await window.myAPI.invoke('show-message-box', {
                    type: 'error',
                    title: 'Registration Error',
                    message: result.message
                });
            }
        } catch (err) {
            console.error('Error:', err);
            await window.myAPI.invoke('show-message-box', {
                type: 'error',
                title: 'Network Error',
                message: 'An error occurred during registration. Please try again later.'
            });
        }
    });
});
