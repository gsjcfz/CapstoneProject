import config from './config.js';

const quizContainer = document.getElementById('quiz_container');
const progressBarContainer = document.getElementById('progress_bar_container');

let correctAnswersCount = 0; // Tracks the number of correct answers
let totalPointsGained = 0; // Tracks the total points gained
let totalPointsPossible = 0; // Tracks the total points possible
const maxScore = 100; // The maximum score, for example, if 10 questions and each is wo

let allQuestions = []; // Array to store all questions from the server
let currentQuestionIndex = 0; // Tracks the current question index

document.addEventListener('DOMContentLoaded', (event) => {
    const packId = localStorage.getItem('currentPackID');
    loadQuestionsFromServer(packId);
    addProgressBar();
    updateProgress();
    
});

document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('navigate', 'game');
});


async function loadQuestionsFromServer(packId) {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex'; // Show loading screen

    try {
        const response = await fetch(`${config.web_server.host}/question/all?pack=${packId}`);
        const data = await response.json();
        allQuestions = data; // Store fetched questions in allQuestions

        // Calculate total points possible
        allQuestions.forEach(question => {
            totalPointsPossible += question.point_value;
        });

        loadQuestionFromServerData();
    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
        loadingScreen.style.display = 'none'; // Hide loading screen
    }

    
}


function loadQuestionFromServerData() {
    if (currentQuestionIndex < allQuestions.length) {
        const questionData = allQuestions[currentQuestionIndex];
        switch(questionData.type) {
            case 'Multiple_Choice':
                addMultipleChoiceQuestionFromServerData(questionData);
                break;
            case 'Matching':
                addMatchingQuestionFromServerData(questionData);
                break;
            case 'Check_All_That_Apply':
                addCheckAllThatApplyQuestionFromServerData(questionData);
                break;
            default:
                console.error(`Unsupported question type: ${questionData.type}`);
        }
    } else {
        // Handle quiz completion
        console.log('Quiz completed');
    }
}

async function sendFinalScore(score) {
    const packId = localStorage.getItem('currentPackID');
    const username = localStorage.getItem('username'); // Assuming the username is stored in local storage
    const loadingResults = document.getElementById('loadingResults');
    loadingResults.style.display = 'block'; // Show loading message

    try {
        const response = await fetch(
            `${config.web_server.host}/playerscore?pack=${packId}&user=${username}&score=${score}`, 
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('accessToken')
            }
        });

        if (response.headers.get('Content-Type').includes('text/html')) {
            const htmlResponse = await response.text();
            console.log('HTML response:', htmlResponse);
            // Process the HTML response as needed
        } else {
            console.error('Unexpected response type');
        }
    } catch (error) {
        console.error('Error updating score:', error);
        alert(`An error occurred: ${error.message}`);
    } finally {
        loadingResults.style.display = 'none'; // Hide loading message
    }
}


// Modified loadNextQuestion function
async function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < allQuestions.length) {
        loadQuestionFromServerData();
        updateProgress(); // Update the progress bar after loading the next question
    } else {
        updateProgress();
        let finalScore = totalPointsGained;
        console.log('Quiz completed. Final Score:', finalScore);
        await sendFinalScore(finalScore);
        window.myAPI.send('navigate', 'game');
    }
}

function addCheckAllThatApplyQuestionFromServerData(questionData) {
    clearQuizContent();

    if (questionData.type === 'Check_All_That_Apply' && questionData.prompt && questionData.prompt.length > 0) {
        const questionPrompt = questionData.prompt[0]; // Assuming the first prompt is the one to be used
        const questionEl = document.createElement('h2');
        questionEl.textContent = questionPrompt.text;
        quizContainer.appendChild(questionEl);

        questionPrompt.answer.forEach((option) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'check_all_option';
            checkbox.value = option.correct; // Store whether the option is correct
            
            label.className = 'checkbox_all_option_label';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(option.text));
            quizContainer.appendChild(label);
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.className = 'submit-btn';
        submitButton.addEventListener('click', () => handleCheckAllThatApplySubmission(questionPrompt.answer));
        quizContainer.appendChild(submitButton);
    } else {
        console.error('Invalid question type or no prompts found for Check All That Apply');
    }
}

function handleCheckAllThatApplySubmission(options) {
    const checkboxes = document.querySelectorAll('.check_all_option');
    let isCorrect = true;

    checkboxes.forEach((checkbox, index) => {
        const correctAnswer = options[index].correct === 1;
        if (checkbox.checked !== correctAnswer) {
            isCorrect = false;
        }
    });

    updateProgress(isCorrect);
    loadNextQuestion();
}

function addMultipleChoiceQuestionFromServerData(questionData) {
    clearQuizContent();

    // Check if the question is of type 'Multiple_Choice' and has prompts
    if (questionData.type === 'Multiple_Choice' && questionData.prompt && questionData.prompt.length > 0) {
        const questionPrompt = questionData.prompt[0]; // Assuming the first prompt is the one to be used
        const questionEl = document.createElement('h1');
        questionEl.textContent = questionPrompt.text; // Set the question text
        quizContainer.appendChild(questionEl);

        questionPrompt.answer.forEach((option) => {
            const button = document.createElement('button');
            button.textContent = option.text; // Set the option text
            button.className = 'mc_option';
            button.addEventListener('click', () => {
                const isCorrect = option.correct === 1; // Check if the option is the correct answer
                updateProgress(isCorrect);
                loadNextQuestion();
            });
            quizContainer.appendChild(button);
        });
    } else {
        // If the question is not a multiple-choice question or does not have prompts
        // You can handle this scenario as per your application's needs
        console.error('Invalid question type or no prompts found');
    }
}


function addMatchingQuestionFromServerData(questionData) {
    clearQuizContent();

    if (questionData.type === 'Matching' && questionData.prompt && questionData.prompt.length > 0) {
        questionData.prompt.forEach(prompt => {
            const promptEl = document.createElement('h2');
            promptEl.textContent = prompt.text;
            quizContainer.appendChild(promptEl);

            prompt.answer.forEach(option => {
                const label = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.className = 'check_all_option';
                radio.value = option.correct; // Store whether the option is correct
                radio.name = prompt.text;

                label.className = 'matching_option'
                label.appendChild(radio);
                label.appendChild(document.createTextNode(option.text));
                quizContainer.appendChild(label);
            });
        });
        const br = document.createElement('br');

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.className = 'submit-btn';
        submitButton.addEventListener('click', () => handleMatchingSubmission(questionData.prompt));
        quizContainer.appendChild(br);
        quizContainer.appendChild(submitButton);
    } else {
        console.error('Invalid question type or no prompts found for Matching');
    }
}

function handleMatchingSubmission(prompts) {
    
    let isCorrect = true;
    const radios = document.querySelectorAll('.check_all_option');
    radios.forEach((radio, index) => {
        const shouldBeChecked = prompts[Math.floor(index / prompts[0].answer.length)].answer[index % prompts[0].answer.length].correct === 1;
        if (radio.checked !== shouldBeChecked) {
            isCorrect = false;
        }
    });
    updateProgress(isCorrect);
    loadNextQuestion();
}


function clearQuizContent() {
    quizContainer.innerHTML = ''; // Clears out all inner content
    scoreDisplay.textContent = `Current Score: ${totalPointsGained}/${totalPointsPossible} Points`;
}

function addProgressBar() {
    // This should only be done once, so we first check if it already exists
    if (!document.getElementById('mc_progress')) {
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const progress = document.createElement('div');
        progress.className = 'progress';
        progress.id = 'mc_progress';
        progress.style.width = '0%'; // Initialize with 0% width

        progressBar.appendChild(progress);
        progressBarContainer.appendChild(progressBar);

        // Insert the progress bar container right before the quiz container
        document.body.insertBefore(progressBarContainer, quizContainer);
    }
}

// Modified updateProgress function
function updateProgress(isCorrect) {
    if (isCorrect) {
        correctAnswersCount++;
        totalPointsGained += allQuestions[currentQuestionIndex].point_value;
    }
    if(isCorrect == false)
    {
        triggerRedFlash();
    }
    // Add any other logic you need for incorrect answers or other conditions

    // Calculate progress percentage
    let progressPercentage = (currentQuestionIndex / allQuestions.length) * 100;

    // Update the progress bar width with animation
    const progressBar = document.getElementById('mc_progress');
    progressBar.style.width = `${progressPercentage}%`;

    // Update score display or any other UI elements as needed
    updateScoreDisplay();
}

function triggerRedFlash() {
    const body = document.body;
    body.classList.add('flash-effect');

    setTimeout(() => {
        body.classList.remove('flash-effect');
    }, 1000); // This should match the duration of the animation
}

// Modified updateScoreDisplay function
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = `Current Score: ${totalPointsGained}/${totalPointsPossible} Points`;
}

// Call updateScoreDisplay() in the same places you call updateProgress()


// The functions for addMultipleChoiceQuestion, addSelectAllThatApplyQuestion and any other question types
// should follow a similar pattern to the addTrueFalseQuestion function, adjusting for the specific requirements of the question type.