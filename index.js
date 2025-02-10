String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

addEventListener("DOMContentLoaded", (event) => {
    var noButtonMovementWorking = false;

    let sentenceToGuess = "Will you be my Valentine?";
    let currentState = '';
    let renderedCurrentState = '';
    let guessedLetters = [];
    let errorLetters = [];
    let numberOfLives = 3;

    let letterInput = document.querySelector('#letterInput');
    let sentenceToGuessSpan = document.querySelector("#sentence-to-guess");
    let submitButton = document.querySelector("#submit");
    let guessedLettersDiv = document.querySelector("#guessedLettersDiv");
    let errorLettersDiv = document.querySelector("#errorLetterDiv");
    let errorParagraph = document.querySelector("#errorParagraph");
    let numberOfLivesSpan = document.querySelector("#numberOfLivesSpan");
    let gameHeaderDiv = document.querySelector("#game-header");
    let accordionGroupDiv = document.querySelector("#accordion-group");
    let buttonsanswerDiv = document.querySelector("#buttons-answer");
    let buttonsanswerNoDiv = document.querySelector("#buttons-answer-no");
    let buttonsanswerYesDiv = document.querySelector("#buttons-answer-yes");
    let gameOverDiv = document.querySelector("#game-over-div");
    let mainDiv = document.querySelector("#main-div");
    let firstStepDiv = document.querySelector("#first-step");
    let smileImg = document.querySelector("#image-smile");
    let startGameBtn = document.querySelector("#startGame");

    document.addEventListener('keydown', (event) => {
        if(event.key !== 'Enter')
            return;
        submit(event);
    });
    letterInput.addEventListener("input", letterInutTextChanged);
    submitButton.addEventListener("click", submit);
    buttonsanswerNoDiv.addEventListener("mouseover", noAnswered);
    buttonsanswerYesDiv.addEventListener("click", yesAnswered);
    startGameBtn.addEventListener("click", startGame);

    for(let i = 0; i < sentenceToGuess.length; i++){
        if(sentenceToGuess[i] === ' '){
            currentState += ' '
        }
        else{
            currentState += '_';
        }

        renderedCurrentState += '<div class="' + (currentState[i] === ' ' ? 'masked-letter-invisible' : 'masked-letter') + '"></div>'
    }

    numberOfLivesSpan.innerHTML = numberOfLives;
    sentenceToGuessSpan.innerHTML = renderedCurrentState;

    function letterInutTextChanged(event){
        if(event.data.length > 1){
            event.target.value = event.data[0];
        }
        if(event.target.value.length > 1){
            event.target.value = event.data;
        }
        event.target.value = event.target.value.toUpperCase()
    }

    function submit(event){
        if(numberOfLives === 0){
            location.reload();
        }

        errorParagraph.style.display = "none";

        if(letterInput.value.length < 1)
            return;

        if(guessedLetters.includes(letterInput.value)){
            showError('You already tried that letter!');
        }

        if(errorLetters.includes(letterInput.value)){
            showError('You already failed that letter!');
        }

        let foundLetter = false;

        for(let i = 0; i < sentenceToGuess.length; i++){
            if(letterInput.value === (sentenceToGuess[i].toUpperCase())){
                currentState = currentState.replaceAt(i, sentenceToGuess[i]);
                if(!guessedLetters.includes(letterInput.value))
                    guessedLetters.push(letterInput.value);
                foundLetter = true;
            }
        }

        if(!foundLetter){
            if(!errorLetters.includes(letterInput.value)){
                numberOfLives--;
                errorLetters.push(letterInput.value);
            }
        }

        // Rendering view
        sentenceToGuessSpan.innerHTML = '';

        for (let i = 0; i < currentState.length; i++){
            sentenceToGuessSpan.innerHTML += '<div id="masked-'+ i +'" class="' + (currentState[i] === ' ' ? 'masked-letter-invisible' : 'masked-letter') + ' text-center">' + (currentState[i] === '_' ? '' : currentState[i]) + '</div>';
        }
        
        guessedLettersDiv.innerHTML = guessedLetters.join(', ');
        errorLettersDiv.innerHTML = errorLetters.join(', ');
        letterInput.value = '';
        numberOfLivesSpan.innerHTML = numberOfLives;

        // Game summary
        if(currentState === sentenceToGuess){
            sentenceGuessed();
        }
            

        if(numberOfLives === 0){
            showError('Przegrana')
            letterInput.disabled = true;
            submitButton.value = "Try again!";
        }
    }

    function sentenceGuessed(){
        letterInput.style.display = 'none';
        submitButton.style.display = 'none';
        guessedLettersDiv.style.display = 'none';
        errorLettersDiv.style.display = 'none';
        errorParagraph.style.display = 'none';
        numberOfLivesSpan.style.display = 'none';
        gameHeaderDiv.style.display = 'none';
        accordionGroupDiv.style.display = 'none';
        buttonsanswerDiv.style.display = 'inline'; 
        smileImg.style.display = 'inline';
        for(let i = 0; i < currentState.length; i++){
            let element = document.querySelector('#masked-' + i);
            element.classList.add('masked-letter-game-over');
        }
    }

    function showError(error){
        errorParagraph.style.display = "inline";
        errorParagraph.innerHTML = error;
    }

    function yesAnswered(event){
        let audio = new Audio('./sounds/yes1.mp4');
        audio.play();

        gameOverDiv.style.display = 'inline';
        mainDiv.style.display = 'none';
    }

    function startGame(event){
        mainDiv.style.display = 'inline';
        firstStepDiv.style.display = 'none';
    }

    function noAnswered(event){
        if(this.noButtonMovementWorking)
            return;

        if(!this.noButtonMovementWorking)
            this.noButtonMovementWorking = true;

        let audioIndex = Math.floor(Math.random() * 3) + 1;

        let audio = new Audio('./sounds/no' + audioIndex + '.mp4');
        audio.play();

        const screenWidth = 1400;
        const screenHeight= 600;
        const destinedTop = Math.floor(Math.random() * screenHeight);
        const destinedLeft = Math.floor(Math.random() * screenWidth);

        var interval = setInterval(() => {
            buttonsanswerNoDiv.style.position = 'absolute';
            console.log(buttonsanswerNoDiv);
            let top = buttonsanswerNoDiv.style.top.replace('px', '');
            let left = buttonsanswerNoDiv.style.left.replace('px', '');
            let speed = 40;
            let topSpeed = speed;
            let leftSpeed = speed;

            if(parseInt(top) > destinedTop){
                topSpeed *= -1;
            }

            if(parseInt(left) > destinedLeft){
                leftSpeed *= -1;
            }

            buttonsanswerNoDiv.style.top = (parseInt(parseInt((top === '' ? 0 : top)) + topSpeed)) + 'px';
            buttonsanswerNoDiv.style.left = (parseInt(parseInt((left === '' ? 0 : left)) + leftSpeed)) + 'px';

            let currentTop = parseInt(buttonsanswerNoDiv.style.top.replace('px', ''));
            let currentLeft = parseInt(buttonsanswerNoDiv.style.left.replace('px', ''));

            if(topSpeed > 0 && leftSpeed > 0 && currentTop >= destinedTop && currentLeft >= destinedLeft){
                clearInterval(interval);
            }
            else if(topSpeed < 0 && leftSpeed < 0 && currentTop <= destinedTop && currentLeft <= destinedLeft){
                clearInterval(interval);
            }
            else if(topSpeed < 0 && leftSpeed > 0 && currentTop <= destinedTop && currentLeft >= destinedLeft){
                clearInterval(interval);
            }
            else if(topSpeed > 0 && leftSpeed < 0 && currentTop >= destinedTop && currentLeft <= destinedLeft){
                clearInterval(interval);
            }

            //buttonsanswerNoDiv.style.left = left + 'px';
        }, 1);

        //buttonsanswerNoDiv.style.position = 'absolute';
        //buttonsanswerNoDiv.style.top = top + 'px';
        //buttonsanswerNoDiv.style.left = left + 'px';
        this.noButtonMovementWorking = false;
    }
});

