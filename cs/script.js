class SentenceTransformer {
  constructor() {
    this.sentences = []
    this.currentCategory = ""
    this.currentQuestions = []
    this.currentQuestionIndex = 0
    this.currentAnswerIndex = 0
    this.showingAnswer = false

    this.init()
  }

  async init() {
    await this.loadData()
    this.setupEventListeners()
    this.setupTheme()
    this.updateCategoryCounts()
  }

  async loadData() {
    try {
      const response = await fetch("sentence.json")
      const data = await response.json()
      this.sentences = data.sentences
    } catch (error) {
      console.error("Error loading data:", error)
      this.sentences = []
    }
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme()
    })

    // Category cards
    document.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.dataset.category
        this.startCategory(category)
      })
    })

    // Modal controls
    document.getElementById("closeModal").addEventListener("click", () => {
      this.closeModal()
    })

    document.getElementById("showAnswerBtn").addEventListener("click", () => {
      this.showAnswer()
    })

    document.getElementById("nextQuestionBtn").addEventListener("click", () => {
      this.nextQuestion()
    })

    document.getElementById("prevAnswerBtn").addEventListener("click", () => {
      this.previousAnswer()
    })

    document.getElementById("nextAnswerBtn").addEventListener("click", () => {
      this.nextAnswer()
    })

    document.addEventListener("keydown", (e) => {
      if (document.getElementById("questionModal").style.display === "none") return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          if (!this.showingAnswer) {
            this.showAnswer()
          } else {
            this.nextQuestion()
          }
          break
        case "ArrowRight":
          e.preventDefault()
          if (this.showingAnswer) {
            this.nextQuestion()
          }
          break
        case "ArrowLeft":
          e.preventDefault()
          if (this.showingAnswer && this.currentQuestionIndex > 0) {
            this.previousQuestion()
          }
          break
        case "ArrowUp":
          e.preventDefault()
          if (this.showingAnswer) {
            this.previousAnswer()
          }
          break
        case "ArrowDown":
          e.preventDefault()
          if (this.showingAnswer) {
            this.nextAnswer()
          }
          break
        case "Escape":
          this.closeModal()
          break
      }
    })

    // Touch/swipe support
    this.setupTouchEvents()
  }

  setupTouchEvents() {
    let startX = 0
    let startY = 0

    document.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    })

    document.addEventListener("touchend", (e) => {
      if (!startX || !startY) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = startX - endX
      const diffY = startY - endY

      if (document.getElementById("questionModal").style.display === "none") return

      // Horizontal swipes for questions
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0 && this.showingAnswer) {
          this.nextQuestion()
        } else if (diffX < 0 && this.showingAnswer && this.currentQuestionIndex > 0) {
          this.previousQuestion()
        }
      }
      // Vertical swipes for answers
      else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
        if (this.showingAnswer) {
          if (diffY > 0) {
            this.nextAnswer()
          } else {
            this.previousAnswer()
          }
        }
      }

      startX = 0
      startY = 0
    })
  }

  setupTheme() {
    const savedTheme = localStorage.getItem("theme") || "light"
    document.body.setAttribute("data-theme", savedTheme)
  }

  toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme") || "light"
    const newTheme = currentTheme === "light" ? "dark" : "light"

    document.body.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  updateCategoryCounts() {
    const categories = {}

    this.sentences.forEach((sentence) => {
      const type = sentence.type
      categories[type] = (categories[type] || 0) + 1
    })

    document.getElementById("count-assertive-negative").textContent =
      `${categories["Assertive to Negative"] || 0} exercises`
    document.getElementById("count-negative-affirmative").textContent =
      `${categories["Negative to Affirmative"] || 0} exercises`
    document.getElementById("count-assertive-interrogative").textContent =
      `${categories["Assertive to Interrogative"] || 0} exercises`
    document.getElementById("count-compound-complex").textContent =
      `${categories["Compound to Complex"] || 0} exercises`
  }

  startCategory(category) {
    this.currentCategory = category
    this.currentQuestions = this.sentences.filter((s) => s.type === category)
    this.currentQuestionIndex = 0
    this.currentAnswerIndex = 0
    this.showingAnswer = false

    if (this.currentQuestions.length === 0) {
      alert("No questions available for this category.")
      return
    }

    this.showModal()
    this.displayQuestion()
  }

  showModal() {
    const modal = document.getElementById("questionModal")
    modal.style.display = "flex"
    setTimeout(() => modal.classList.add("active"), 10)

    document.getElementById("modalCategoryTitle").textContent = this.currentCategory
  }

  closeModal() {
    const modal = document.getElementById("questionModal")
    modal.classList.remove("active")
    setTimeout(() => {
      modal.style.display = "none"
    }, 300)
  }

  displayQuestion() {
    const question = this.currentQuestions[this.currentQuestionIndex]

    document.getElementById("originalSentence").textContent = question.original
    document.getElementById("questionCounter").textContent =
      `${this.currentQuestionIndex + 1} / ${this.currentQuestions.length}`

    // Reset answer display
    document.getElementById("answerSection").style.display = "none"
    document.getElementById("answerSection").classList.remove("show")
    document.getElementById("multipleAnswers").style.display = "none"
    document.getElementById("showAnswerBtn").style.display = "inline-flex"
    document.getElementById("nextQuestionBtn").style.display = "none"

    this.showingAnswer = false
    this.currentAnswerIndex = 0
  }

  showAnswer() {
    const question = this.currentQuestions[this.currentQuestionIndex]

    this.displayCurrentAnswer()

    document.getElementById("answerSection").style.display = "block"
    setTimeout(() => {
      document.getElementById("answerSection").classList.add("show")
    }, 10)

    // Show multiple answers navigation if more than one answer
    if (question.answers.length > 1) {
      document.getElementById("multipleAnswers").style.display = "block"
      this.updateAnswerNavigation()
    }

    document.getElementById("showAnswerBtn").style.display = "none"
    document.getElementById("nextQuestionBtn").style.display = "inline-flex"

    this.showingAnswer = true
  }

  displayCurrentAnswer() {
    const question = this.currentQuestions[this.currentQuestionIndex]
    const answer = question.answers[this.currentAnswerIndex]

    document.getElementById("answerText").textContent = answer.answer
    document.getElementById("explanationText").textContent = answer.why
  }

  updateAnswerNavigation() {
    const question = this.currentQuestions[this.currentQuestionIndex]
    const totalAnswers = question.answers.length

    document.getElementById("answerCounter").textContent = `${this.currentAnswerIndex + 1} / ${totalAnswers}`

    document.getElementById("prevAnswerBtn").disabled = this.currentAnswerIndex === 0
    document.getElementById("nextAnswerBtn").disabled = this.currentAnswerIndex === totalAnswers - 1
  }

  previousAnswer() {
    const question = this.currentQuestions[this.currentQuestionIndex]
    if (this.currentAnswerIndex > 0) {
      this.currentAnswerIndex--
      this.displayCurrentAnswer()
      this.updateAnswerNavigation()
    }
  }

  nextAnswer() {
    const question = this.currentQuestions[this.currentQuestionIndex]
    if (this.currentAnswerIndex < question.answers.length - 1) {
      this.currentAnswerIndex++
      this.displayCurrentAnswer()
      this.updateAnswerNavigation()
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
      this.currentQuestionIndex++
      this.displayQuestion()
    } else {
      alert("🎉 Congratulations! You've completed all questions in this category!")
      this.closeModal()
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--
      this.displayQuestion()
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SentenceTransformer()
})
