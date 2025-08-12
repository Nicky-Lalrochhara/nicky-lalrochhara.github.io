document.addEventListener('DOMContentLoaded', () => {
    // Quiz questions
    const quizQuestions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars"
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            answer: "Blue Whale"
        },
        {
            question: "Which language runs in a web browser?",
            options: ["Java", "C", "Python", "JavaScript"],
            answer: "JavaScript"
        },
        {
            question: "What year was JavaScript launched?",
            options: ["1996", "1995", "1994", "none of the above"],
            answer: "1995"
        }
    ];

    // DOM elements
    const questionElement = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options-container');
    const questionCountElement = document.querySelector('.question-count');
    const scoreElement = document.querySelector('.score');
    const timerElement = document.querySelector('.timer');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const submitButton = document.getElementById('submit-btn');
    const restartButton = document.getElementById('restart-btn');
    const quizBody = document.querySelector('.quiz-body');
    const quizResult = document.querySelector('.quiz-result');
    const finalScoreElement = document.getElementById('final-score');
    const correctAnswersElement = document.getElementById('correct-answers');
    const wrongAnswersElement = document.getElementById('wrong-answers');
    const totalQuestionsElement = document.getElementById('total-questions');
    const timeTakenElement = document.getElementById('time-taken');
    const confettiContainer = document.querySelector('.confetti-container');

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptions = Array(quizQuestions.length).fill(null);
    let timer;
    let timeLeft = 30;
    let quizStartTime;
    let totalTimeTaken = 0;

    // Initialize quiz
    function initQuiz() {
        quizStartTime = new Date();
        loadQuestion();
        startTimer();
    }

    // Load question
    function loadQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;

        // Update question count
        questionCountElement.textContent = `Question: ${currentQuestionIndex + 1}/${quizQuestions.length}`;

        // Clear previous options
        optionsContainer.innerHTML = '';

        // Create options
        currentQuestion.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;

            // Restore previous answer highlight if navigating back
            if (selectedOptions[currentQuestionIndex] === option) {
                if (option === currentQuestion.answer) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('wrong');
                }
            }

            optionElement.addEventListener('click', () => selectOption(option, optionElement));
            optionsContainer.appendChild(optionElement);
        });

        // Update button states
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.disabled = false;

        // Show submit button only on last question
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextButton.classList.add('hidden');
            submitButton.classList.remove('hidden');
        } else {
            nextButton.classList.remove('hidden');
            submitButton.classList.add('hidden');
        }
    }

    // Select option
    function selectOption(option, optionElement) {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        // Remove previous highlight
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'wrong');
        });

        // Store selected option
        selectedOptions[currentQuestionIndex] = option;

        // If answer is correct
        if (option === currentQuestion.answer) {
            optionElement.classList.add('correct');
        } else {
            // Mark wrong answer in red
            optionElement.classList.add('wrong');

            // Highlight correct answer in green
            document.querySelectorAll('.option').forEach(opt => {
                if (opt.textContent === currentQuestion.answer) {
                    opt.classList.add('correct');
                }
            });
        }
    }

    // Check answer
    function checkAnswer() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        return selectedOptions[currentQuestionIndex] === currentQuestion.answer;
    }

    // Update score
    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    // Start timer
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

    // Auto proceed when time runs out
    function autoProceed() {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            nextQuestion();
        } else {
            submitQuiz();
        }
    }

    // Next question
    function nextQuestion() {
        // Check if an option is selected
        if (selectedOptions[currentQuestionIndex] !== null) {
            if (checkAnswer()) {
                score++;
                updateScore();
            }
            currentQuestionIndex++;
            loadQuestion();
            startTimer();
        } else {
            alert('Please select an option before proceeding.');
        }
    }

    // Previous question
    function prevQuestion() {
        currentQuestionIndex--;
        loadQuestion();
        startTimer();
    }

    // Submit quiz
    function submitQuiz() {
        clearInterval(timer);

        // Calculate final score
        for (let i = 0; i < quizQuestions.length; i++) {
            if (selectedOptions[i] === quizQuestions[i].answer) {
                score++;
            }
        }

        // Calculate time taken
        const quizEndTime = new Date();
        totalTimeTaken = Math.floor((quizEndTime - quizStartTime) / 1000);

        // Show results
        showResults();
    }

    // Show results
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

    // Restart quiz
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

    // Create confetti effect
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

            setTimeout(() => {
                confetti.remove();
            }, animationDuration * 1000);
        }
    }

    // Add CSS for confetti animation + answer colors
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        .correct {
            background-color: #4CAF50;
            color: white;
        }
        .wrong {
            background-color: #f44336;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Event listeners
    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);
    submitButton.addEventListener('click', submitQuiz);
    restartButton.addEventListener('click', restartQuiz);

    initQuiz();
});
