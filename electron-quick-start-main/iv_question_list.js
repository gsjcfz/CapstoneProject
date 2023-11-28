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
        const add_question_modal = document.getElementById("add_question_modal");
        const aq_form = document.getElementById('aq_form');
        aq_form.addEventListener('submit', async function(e) {
            // Keeps the page from refreshing right after hitting submit
            e.preventDefault();

            const question_type = document.getElementById('type').value;
            switch (question_type) {
                case "Multiple_Choice":
                    multipleChoiceModal();
                    break;
                case "Matching":
                    matchingModal();
                    break;
                case "Check_All_That_Apply":
                    selectAllThatApplyModal();
                    break;
                // You may add more types here
                default:
                    console.error(`unknown question type: ${question_type}`);
            }
            // Close the add question modal
            add_question_modal.style.display = 'none';
        });
        // Open the add question modal
        add_question_modal.style.display = 'block';
    });

    newDiv.appendChild(newButton);
    questionContainer.appendChild(newDiv);
}

function multipleChoiceModal(questionIndex=-1) {
    // -----------============= LOAD THE MODAL =============-----------
    const question_type = "Multiple_Choice";
    let current_id = 0;
    const answerName = "mc_text";
    const correctName = "mc_correct";
    const modal = document.getElementById("question_modal");
    const content = document.getElementById("modal_content");
    content.innerHTML = '';
    
    // Create the form
    const form = document.createElement("form");

    // Create the main input group
    const firstDiv = document.createElement("div");
    firstDiv.className = "input-group";
    // Configure the main input group
    const pointValLabel = document.createElement("label");
    pointValLabel.for = "point_value";
    pointValLabel.textContent = "Point Value:"
    const pointValue = document.createElement("input");
    pointValue.type = "text";
    pointValue.id = "point_value";
    pointValue.name = "point_value";
    pointValue.required = true;
    pointValue.style.width = "auto";
    // Configure the prompt input
    const promptLabel = document.createElement("label");
    promptLabel.for = "prompt";
    promptLabel.textContent = "Prompt:"
    const prompt = document.createElement("textarea");
    prompt.id = "prompt";
    prompt.name = "prompt";
    prompt.required = true;
    prompt.style.width = "auto";
    // Append upwards
    firstDiv.append(pointValLabel, pointValue, promptLabel, prompt);
    form.appendChild(firstDiv);

    // Create empty answer list
    const answers = document.createElement("div");
    answers.id = "mc_answers";
    // Function for adding new answers
    function mcAddAnswer(text="", correct=false) {
        // Create new div to hold answer
        const answer_div = document.createElement("div");
        answer_div.className = "input-group";
        answer_div.style.marginBottom = "3px";
        // Create a button to delete the answer
        const answer_delete = document.createElement("input");
        answer_delete.type = "button";
        answer_delete.value = "-";
        answer_delete.style.cursor = "pointer";
        answer_delete.style.width = "auto";
        answer_delete.style.display = "table-cell";
        answer_delete.style.backgroundColor = "#f44";
        answer_delete.style.marginRight = "5px";
        answer_delete.addEventListener('click', () => {
            answer_div.remove();
        });
        answer_div.appendChild(answer_delete);
        // Create text box input for the answer text
        const answer_text = document.createElement("input");
        answer_text.type = "text";
        answer_text.name = answerName;
        answer_text.id = `mc_text${current_id}`;
        answer_text.required = "required";
        answer_text.value = text;
        answer_text.style.width = "auto";
        answer_text.style.display = "table-cell";
        answer_div.appendChild(answer_text);
        // Create a radio button for whether the answer is correct or not
        const answer_correct = document.createElement("input");
        answer_correct.type = "radio";
        answer_correct.name = correctName;
        answer_correct.id = `mc_correct${current_id}`;
        answer_correct.value = "Correct?";
        answer_correct.required = "required";
        answer_correct.checked = correct;
        answer_correct.style.width = "auto";
        answer_correct.style.display = "table-cell";
        answer_div.appendChild(answer_correct);

        // Append the answer div to the form
        answers.appendChild(answer_div);
        current_id++;
    }
    // Create add answer button
    const newADiv = document.createElement("div");
    const newA = document.createElement("input");
    newA.type = "button";
    newA.value = "New Answer";
    newA.addEventListener('click', () => {
        mcAddAnswer();
    });
    newADiv.appendChild(newA);

    // Append upwards
    form.append(answers, newADiv);

    // Load previous question's data, if applicable
    if (questionIndex != -1) {
        let question = question_data[questionIndex];
        let pObj = question.prompt[0];
        prompt.value = pObj.text;
        pointValue.value = question.point_value;
        for (let i = 0; i < pObj.answer.length; i++) {
            let answer = pObj.answer[i];
            mcAddAnswer(answer.text, Boolean(answer.correct));
        }
    }
    else {
        prompt.value = "";
        pointValue.value = "";
        mcAddAnswer();
    }

    // Close button
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Cancel";
    close.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    // Submit button
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Create";
    // Configure what happens when the form is submitted
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Loop through our answers and get a list of all of them
        const answer_list = [];
        const a_texts = document.getElementsByName(answerName);
        const a_corrects = document.getElementsByName(correctName);
        for (let i = 0; i < a_texts.length; i++) {
            const answer = {
                text    : a_texts[i].value,
                correct : + a_corrects[i].checked
            };
            
            answer_list.push(answer);
        }

        // Set prompt data
        const prompt_list = [{
            text        : prompt.value,
            answer      : answer_list
        }];

        // Set attributes
        const new_question = {
            type        : question_type,
            point_value : Number(pointValue.value),
            pack_ID     : localStorage.getItem("currentPackID"),
            prompt      : prompt_list
        };

        // Replace the old question (if it exists) otherwise, add it
        if (questionIndex != -1) {
            question_data[questionIndex] = new_question;
        }
        else {
            question_data.push(new_question);
        }

        // Reload the question list
        loadCurrentQuestionData();

        modal.style.display = "none";
    });

    // Append upwards
    form.append(submit, close);
    content.append(form);

    modal.style.display = 'block';
}

function matchingModal(questionIndex=-1) {
    
}

function selectAllThatApplyModal(questionIndex=-1) {
    
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
    const questionIndex = question_data.indexOf(question);
    switch (question_type) {
        case "Multiple_Choice":
            addMultipleChoice(question, questionButton);
            // This is the buttons functionality
            questionButton.addEventListener('click', ()=> {
                multipleChoiceModal(questionIndex);
            });
            break;
        case "Matching":
            addMatching(question, questionButton);
            // This is the buttons functionality
            questionButton.addEventListener('click', ()=> {
                matchingModal(questionIndex);
            });
            break;
        case "Check_All_That_Apply":
            addMultipleChoice(question, questionButton);
            // This is the buttons functionality
            questionButton.addEventListener('click', ()=> {
                selectAllThatApplyModal(questionIndex);
            });
            break;
        // You may add more types here
        default:
            console.error(`unknown question type: ${question_type}`);
    }
    
    

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
