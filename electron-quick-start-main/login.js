document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');

    document.getElementById('back').addEventListener('click', () => {
        window.myAPI.send('navigate', 'main');
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        login_btn.textContent = 'Logging In...';
        login_btn.disabled = true;
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
                // Store the access token in local storage
                localStorage.setItem('accessToken', result.token);

                // Use IPC to tell the main process to navigate to the main menu
                window.myAPI.send('navigate', 'main_menu');
            } else {
                
                // Show error message using dialog API from the main process
                await window.myAPI.invoke('show-message-box', {
                    type: 'error',
                    title: 'Login Error',
                    message: 'Error logging in. Please check your credentials.'
                });
                login_btn.textContent = "Login";
                login_btn.disabled = false;
            }
        } catch (err) {
            console.error('Error:', err);
            // Show error message using dialog API from the main process
            login_btn.textContent = "Login";
            login_btn.disabled = false;
            await window.myAPI.invoke('show-message-box', {
                type: 'error',
                title: 'Login Error',
                message: 'An error occurred during login. Please try again later.'
                
            });
        }
    });
});
