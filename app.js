class Quiz {
    API = null;
    API_CATEGORY = {
        'general_knowledge': '9',
        'books': '10',
        'film': '11',
        'video_games': '15',
        'science_nature': '17',
        'sport': '21',
        'geography': '22',
        'history': '23'
    }

    category = null;
    difficulty = null;
    questions = [];
    drawedQuestion = null;
    isGameStarted = false;
    numberOfQuestion = 1;
    numberOfCorrectAnswers = 0;
    numberOfIncorrectAnswers = 0;

    UiSelectors = {
        selectCategory: '[data-select-category]',
        form: '[data-form]',
        selectDifficulty: '[data-select-properties__difficulty]',
        question: '[data-question]',
        answer1: '[data-answer-1]',
        answer2: '[data-answer-2]',
        answer3: '[data-answer-3]',
        answer4: '[data-answer-4]',

    }

    selectCategory = document.querySelector(this.UiSelectors.selectCategory);
    selectDifficulty = document.querySelector(this.UiSelectors.selectDifficulty);
    form = document.querySelector(this.UiSelectors.form);
    question = document.querySelector(this.UiSelectors.question)
    answer = document.querySelectorAll('.answer')
    answer1 = document.querySelector(this.UiSelectors.answer1)
    answer2 = document.querySelector(this.UiSelectors.answer2)
    answer3 = document.querySelector(this.UiSelectors.answer3)
    answer4 = document.querySelector(this.UiSelectors.answer4)
    startGameInfo = document.querySelector('.start-game-info')
    gameBoard = document.querySelector('.game-board')
    pointsCounter = document.querySelector('.points-counter')
    questionNumber = document.querySelector('.question-number strong')
    correctAnswersNumber = document.querySelector('.correct-answers strong')
    incorrectAnswersNumber = document.querySelector('.incorrect-answers strong')

    initialize() {
        this.addEventListeners()
    }

    addEventListeners() {
        this.selectCategory.addEventListener('change', this.selectedCategory)
        this.selectDifficulty.addEventListener('change', this.selectedDifficulty)
        this.form.addEventListener('submit', this.startGame)
        this.answer.forEach(answer => {
            answer.addEventListener('click', this.checkAnswer)
        })

    }

    selectedCategory = (e) => {
        this.category = e.target.value


    }

    selectedDifficulty = (e) => {
        this.difficulty = e.target.value
    }

    changeApiPath() {
        const numberOfCategory = this.API_CATEGORY[this.category]

        this.API = `https://opentdb.com/api.php?amount=10&category=${numberOfCategory}&difficulty=${this.difficulty}&type=multiple`
    }

    fetchData() {
        this.changeApiPath()
        fetch(this.API)
            .then(response => response.json())
            .then(data => this.questions = data.results)
            .then(() => this.showQuestion())
            .catch(err => console.error(err))
    }

    drawQuestion = () => {
        const drawedQuestionIndex = Math.floor(Math.random() * this.questions.length)
        const drawedQuestion = this.questions[drawedQuestionIndex]
        this.drawedQuestion = drawedQuestion
        this.questions.splice(drawedQuestionIndex, 1)
    }

    showQuestion() {
        this.drawQuestion()
        this.showAnswers()
        this.question.innerHTML = this.drawedQuestion.question
    }

    showAnswers() {
        const {
            incorrect_answers,
            correct_answer
        } = this.drawedQuestion
        const answers = [...incorrect_answers, correct_answer].sort()

        this.answer1.innerHTML = answers[0];
        this.answer2.innerHTML = answers[1];
        this.answer3.innerHTML = answers[2];
        this.answer4.innerHTML = answers[3];
    }

    checkAnswer = (e) => {
        const clickedAnswer = e.target.innerText

        if (clickedAnswer === this.drawedQuestion.correct_answer) {
            e.target.classList.add('win')
                ++this.numberOfCorrectAnswers
        } else {
            e.target.classList.add('loss')
            setTimeout(this.showCorrectAnswer, 1000)
                ++this.numberOfIncorrectAnswers
        }

        if (this.numberOfQuestion < 10) {
            ++this.numberOfQuestion
        }

        if (this.numberOfCorrectAnswers + this.numberOfIncorrectAnswers === 10) {
            setTimeout(this.pointsHandler, 2500)
            setTimeout(this.newGame, 5000)
        }

        this.answer.forEach(answer => {
            answer.removeEventListener('click', this.checkAnswer)
        })

        setTimeout(this.showNextQuestion, 4000)
    }

    showCorrectAnswer = () => {
        for (const showedAnswer of this.answer) {
            if (showedAnswer.innerText.includes(this.drawedQuestion.correct_answer)) {
                showedAnswer.classList.add('win')
            }
        }
    }

    visibilityHandler() {
        if (this.isGameStarted) {
            this.startGameInfo.classList.add('hide')
            this.gameBoard.classList.remove('hide')
            this.form.classList.add('hide')
            this.pointsCounter.classList.remove('hide')
        } else {
            this.startGameInfo.classList.remove('hide')
            this.gameBoard.classList.add('hide')
            this.form.classList.remove('hide')
            this.pointsCounter.classList.add('hide')
        }
    }

    showNextQuestion = () => {
        this.pointsHandler()
        this.addEventListeners()
        this.showQuestion()
        this.answer.forEach(answer => {
            answer.classList.remove('win', 'loss')
        })
    }

    pointsHandler = () => {
        this.questionNumber.innerText = this.numberOfQuestion
        this.correctAnswersNumber.innerText = this.numberOfCorrectAnswers
        this.incorrectAnswersNumber.innerText = this.numberOfIncorrectAnswers
    }

    newGame = () => {
        this.isGameStarted = false;
        this.visibilityHandler()
        this.numberOfQuestion = 1;
        this.numberOfCorrectAnswers = 0;
        this.numberOfIncorrectAnswers = 0;
        this.category = null;
        this.difficulty = null;
        this.questions = [];
        this.drawedQuestion = null;
        this.answer.forEach(answer => {
            answer.classList.remove('win', 'loss')
        });
        this.question.innerHTML = "";
        this.answer1.innerHTML = "";
        this.answer2.innerHTML = "";
        this.answer3.innerHTML = "";
        this.answer4.innerHTML = "";
    }

    startGame = (e) => {
        e.preventDefault()
        if (this.category && this.category !== "select_category" && this.difficulty && this.difficulty !== "select_difficulty") {
            this.fetchData()
            this.isGameStarted = true;
            this.visibilityHandler()
            this.pointsHandler()
        } else {
            return alert('Please select category and difficulty level')
        }
    }
}


const quiz = new Quiz();
quiz.initialize()