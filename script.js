document.addEventListener('DOMContentLoaded', () => {
    const quizQuestions = [
        { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], answer: "Paris" },
        { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
        { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"], answer: "Blue Whale" },
        { question: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"], answer: "JavaScript" },
        { question: "What year was JavaScript launched?", options: ["1996", "1995", "1994", "none of the above"], answer: "1995" }
    ];

    const questionElement = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options-container');
    const questionCountElement = document.querySelector('.question-count');
    const scoreElement = document.querySelector('.score');
    const timerElement = document.querySelector('.timer');
    const restartButton = document.getElementById('restart-btn');
    const quizBody = document.querySelector('.quiz-body');
    const quizResult = document.querySelector('.quiz-result');
    const finalScoreElement = document.getElementById('final-score');
    const correctAnswersElement = document.getElementById('correct-answers');
    const wrongAnswersElement = document.getElementById('wrong-answers');
    const totalQuestionsElement = document.getElementById('total-questions');
    const timeTakenElement = document.getElementById('time-taken');
    const confettiContainer = document.querySelector('.confetti-container');

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptions = Array(quizQuestions.length).fill(null);
    let timer;
    let timeLeft = 30;
    let quizStartTime;
    let totalTimeTaken = 0;

    function initQuiz() {
        quizStartTime = new Date();
        loadQuestion();
        startTimer();
    }

    function loadQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        questionCountElement.textContent = `Question: ${currentQuestionIndex + 1}/${quizQuestions.length}`;
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;

            optionElement.addEventListener('click', () => {
                if (selectedOptions[currentQuestionIndex] !== null) return;

                selectedOptions[currentQuestionIndex] = option;

                if (option === currentQuestion.answer) {
                    optionElement.style.backgroundColor = 'lightgreen';
                    score++;
                    updateScore();
                } else {
                    optionElement.style.backgroundColor = 'lightcoral';
                    [...optionsContainer.children].forEach(child => {
                        if (child.textContent === currentQuestion.answer) {
                            child.style.backgroundColor = 'lightgreen';
                        }
                    });
                }

                [...optionsContainer.children].forEach(child => {
                    child.style.pointerEvents = 'none';
                });

                clearInterval(timer);

                setTimeout(() => {
                    if (currentQuestionIndex < quizQuestions.length - 1) {
                        currentQuestionIndex++;
                        loadQuestion();
                        startTimer();
                    } else {
                        submitQuiz();
                    }
                }, 1000);
            });

            optionsContainer.appendChild(optionElement);
        });
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = 30;
        timerElement.textContent = `Time: ${timeLeft}s`;

        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                autoProceed();
            }
        }, 1000);
    }

    function autoProceed() {
        if (selectedOptions[currentQuestionIndex] === null) {
            // Mark unanswered as wrong, highlight correct
            [...optionsContainer.children].forEach(child => {
                if (child.textContent === quizQuestions[currentQuestionIndex].answer) {
                    child.style.backgroundColor = 'lightgreen';
                }
            });
        }
        setTimeout(() => {
            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
                startTimer();
            } else {
                submitQuiz();
            }
        }, 1000);
    }

    function submitQuiz() {
        clearInterval(timer);
        const quizEndTime = new Date();
        totalTimeTaken = Math.floor((quizEndTime - quizStartTime) / 1000);
        showResults();
    }

    function showResults() {
        quizBody.classList.add('hidden');
        quizResult.classList.remove('hidden');

        finalScoreElement.textContent = score;
        correctAnswersElement.textContent = score;
        wrongAnswersElement.textContent = quizQuestions.length - score;
        totalQuestionsElement.textContent = quizQuestions.length;
        timeTakenElement.textContent = totalTimeTaken;

        if (score >= quizQuestions.length * 0.7) {
            createConfetti();
        }
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        selectedOptions = Array(quizQuestions.length).fill(null);
        totalTimeTaken = 0;
        quizBody.classList.remove('hidden');
        quizResult.classList.add('hidden');
        scoreElement.textContent = `Score: 0`;
        confettiContainer.innerHTML = '';
        initQuiz();
    }

    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-10px';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            const animationDuration = Math.random() * 3 + 2;
            confetti.style.animation = `fall ${animationDuration}s linear forwards`;
            confettiContainer.appendChild(confetti);
            setTimeout(() => confetti.remove(), animationDuration * 1000);
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    restartButton.addEventListener('click', restartQuiz);
    initQuiz();
});
