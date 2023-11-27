import config from './config.js';

let question_data = [];

function loadCurrentQuestionData() {
    console.log(question_data);

    const questionContainer = document.getElementById("question_container");
    questionContainer.innerHTML = "";
    const header = document.createElement("h2");
    header.textContent = "Edit Questions:"
    questionContainer.appendChild(header);
    for (let i = 0; i < question_data.length; i++) {
        let obj = question_data[i];
        addQuestion(obj);
    }

    // This will be the button to create a new question.
    // When clicking this, it should create a new element in the global variable question data, 
    // and open the modal to edit a question
    const newDiv = document.createElement("div");
    const newButton = document.createElement("button");
    newButton.className = "question-create";
    const createText = document.createTextNode("Create New Question");
    newButton.appendChild(createText);
    // This is the buttons functionality
    newButton.addEventListener('click', async ()=> {
        // Edit the functionality of the add pack modal
        // TODO: Configure modals!
        const add_question_modal = document.getElementById("add_question_modal");
        const aq_form = document.getElementById('aq_form');
        aq_form.addEventListener('submit', async function(e) {
            // Keeps the page from refreshing right after hitting submit
            e.preventDefault();

            const question_type = document.getElementById('type').value;
            // TODO: Navigate to edit question
            // Close the add pack modal
            add_question_modal.style.display = 'none';
        });

        // Open the add pack modal
        add_question_modal.style.display = 'block';
    });

    newDiv.appendChild(newButton);
    questionContainer.appendChild(newDiv);
}

function addMultipleChoice(question, qElement) {
    // Loop through prompts
    const prompts = question.prompt;
    for (let i = 0; i < prompts.length; i++) {
        let pObj = prompts[i];
        // Create the div for the prompt
        const promptDiv = document.createElement("div");
        // Create the text node for the prompt
        const promptText = document.createTextNode(`Prompt: ${pObj.text}`);
        promptDiv.appendChild(promptText);
        // Create UL for the answers
        const answerList = document.createElement("ul");
        // Loop through possible answers
        const answers = pObj.answer;
        for (let j = 0; j < answers.length; j++) {
            let aObj = answers[j];
            let correct = aObj.correct === 1 ? 'Correct' : 'Incorrect';
            // Create list item for the answer
            const answer = document.createElement("li");
            answer.textContent = `${aObj.text} - ${correct}`;
            // Append the list item to the ul
            answerList.appendChild(answer);
        }
        // Append the answer list to the prompt div
        promptDiv.appendChild(answerList);
        // Append the prompt div to the question element
        qElement.appendChild(promptDiv);
    }
}

function addMatching(question, qElement) {
    // Create UL for prompts
    const promptList = document.createElement("ul");
    // Loop through prompts
    const prompts = question.prompt;
    for (let i = 0; i < prompts.length; i++) {
        let pObj = prompts[i];
        // Loop through possible answers
        const answers = pObj.answer;
        for (let j = 0; j < answers.length; j++) {
            let aObj = answers[j];
            // Only set the text content if the answer is correct
            if (aObj.correct === 1) {
                // Set the text content and break from the loop
                const prompt = document.createElement('li');
                prompt.textContent = `${pObj.text} -> ${aObj.text}`
                promptList.appendChild(prompt);
                break;
            }
        }
    }
    qElement.appendChild(promptList);
}

function addQuestion(question) {
    // This is the container that lists the questions
    const questionContainer = document.getElementById("question_container");
    // This div will hold the button that represents the question
    const questionHolder = document.createElement("div");
    // This is the button that will represent the question
    const questionButton = document.createElement("button");
    questionButton.className = "question";
    // This is the node for displaying the questions point value
    const pointValue = document.createTextNode(`Point Value: ${question.point_value}`);
    questionButton.appendChild(pointValue);
    
    const question_type = question.type;
        switch (question_type) {
            case "Multiple_Choice":
                addMultipleChoice(question, questionButton);
                break;
            case "Matching":
                addMatching(question, questionButton);
                break;
            case "Check_All_That_Apply":
                addMultipleChoice(question, questionButton);
                break;
            // You may add more types here
            default:
                console.error(`unknown question type: ${question_type}`);
        }
    
    // This is the buttons functionality
    questionButton.addEventListener('click', ()=> {
        // TODO: create navigation to modal
    });

    // This is the button for deletion
    const deleteButton = document.createElement("button");
    deleteButton.style.backgroundColor = '#f55';
    const deleteText = document.createTextNode("Delete");
    // This is the modal that will appear when the user tries to delete a question
    const delete_modal = document.getElementById("delete_question_modal");
    deleteButton.addEventListener('click', async ()=> {
        const dq_submit = document.getElementById('dq_submit-modal');

        dq_submit.addEventListener('click', async ()=>{
            // Change the text of the modal button to let the user know its working
            // Remove the element from global question data
            const question_index = question_data.indexOf(question);
            if (question_index > -1) {
                question_data.splice(question_index, 1);
            }
            // Reload questions
            loadCurrentQuestionData();
            // Hide the modal
            delete_modal.style.display = 'none';
        });
        delete_modal.style.display = 'block';
    });
    deleteButton.className = "pack-delete";
    deleteButton.appendChild(deleteText);

    // Now we append up the list
    questionHolder.appendChild(questionButton);
    questionHolder.appendChild(deleteButton);
    questionContainer.appendChild(questionHolder);
}

document.addEventListener('DOMContentLoaded', async function(event) {
    const pack_ID = localStorage.getItem('currentPackID');
    // Configure Modal Elements
    // Delete question modal
    const delete_question_modal = document.getElementById('delete_question_modal');
    const dq_modal_close = document.getElementById('dq_close-modal');
    dq_modal_close.addEventListener('click', () => {
        delete_question_modal.style.display = 'none';
    });
    // Add question modal
    const add_question_modal = document.getElementById('add_question_modal');
    const aq_modal_close = document.getElementById('aq_close-modal');
    aq_modal_close.addEventListener('click', () => {
        add_question_modal.style.display = 'none';
    });
    // TODO: Add New Modals

    // We load in all the question data here
    await fetch(`${config.web_server.host}/question/all?pack=${pack_ID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('accessToken')
        }
    })
        .then(response => response.json())
        .then(data => {
            // Remove our skeleton questions
            const skeletons = document.querySelectorAll(".skeleton");
            for (let i = 0; i < skeletons.length; i++) {
                skeletons.item(i).remove();
            }

            // Set global question data
            question_data = JSON.parse(JSON.stringify(data));

            // Add the question data to UI
            loadCurrentQuestionData();
        });
});

document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('navigate', 'iv_packs');
});
