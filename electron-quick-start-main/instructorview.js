document.addEventListener('DOMContentLoaded', (event) => {
    const mc_options = document.querySelectorAll('.mc_option');
    const mc_modal = document.getElementById('mc_modal');
    const mc_modalText = document.getElementById('mc_modal-text');
    const mc_closeModal = document.getElementById('mc_close-modal');
    
    let correctAnswersCount = 0;

    mc_closeModal.addEventListener('click', () => {
        mc_modal.style.display = 'none';
    });

    mc_options.forEach(mc_option => {
        mc_option.addEventListener('click', function() {
            const selectedAnswer = this.getAttribute('data-answer');
            const mc_progress = document.getElementById('mc_progress');
            
            if (selectedAnswer === '4') { 
                mc_modalText.textContent = "Correct!";
                correctAnswersCount++;

            } else {
                mc_modalText.textContent = "Incorrect!";
                if (correctAnswersCount > 0) {
                    correctAnswersCount--;  // Decrement the correct answers count if it's greater than 0
                }
            }

            // Update the progress bar based on correct answers
            let progressPercentage = (correctAnswersCount / 10) * 100;
            mc_progress.style.width = `${progressPercentage}%`;

            mc_modal.style.display = 'block';
        });
    });
});
document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('back-to-menu');
});
