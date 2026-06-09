const questions = [

  {
    question: "What you call an sick eagle in English?",
    answer: "illegal"
  },

  {
    question: "What kind of tree fits in your hand?",
    answer: "palm tree"
  },

  {
    question: "What do you call a cold puppy?",
    answer: "chilli dog"
  },

  {
    question: "What do you call a very small mother?",
    answer: "minimum"
  },

  {
    question: "What do you call a funny mountain?",
    answer: "hill-arious"
  }

];

let currentQuestion = 0;

let score = 0;

let playerName = "";

function startQuiz(){

  playerName = document.getElementById("playerName").value;

  if(playerName === ""){
    alert("Please enter your name");
    return;
  }

  currentQuestion = 0;
  score = 0;

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  loadQuestion();

}

function loadQuestion(){
  document.getElementById("questionNumber").innerText = "Question " + (currentQuestion + 1) + "/" + questions.length;
  document.getElementById("questionText").innerText = questions[currentQuestion].question;

  const answerInput = document.getElementById("answerInput");
  answerInput.value = "";
  answerInput.disabled = false;
  answerInput.focus();

  document.getElementById("emojiResult").innerText = "";

  const feedback = document.getElementById("correctAnswer");
  feedback.innerText = "";
  feedback.classList.remove("correct");
  feedback.classList.remove("wrong");

  document.getElementById("submitButton").disabled = false;
  document.getElementById("submitButton").classList.remove("hidden");

  document.getElementById("nextButton").classList.add("hidden");
}

function checkAnswer(){
  const userAnswer = document.getElementById("answerInput").value.toLowerCase().replace(/\s/g,'');
  const correctAnswer = questions[currentQuestion].answer.toLowerCase().replace(/\s/g,'');

  document.getElementById("answerInput").disabled = true;
  document.getElementById("submitButton").disabled = true;
  document.getElementById("submitButton").classList.add("hidden");
  document.getElementById("nextButton").classList.remove("hidden");

  const feedback = document.getElementById("correctAnswer");

  if(userAnswer === correctAnswer){
    score++;
    document.getElementById("emojiResult").innerText = "🎉🥳😂";
    feedback.innerText = "Well done!";
    feedback.classList.add("correct");
    createBlast("🎉");
  } else {
    document.getElementById("emojiResult").innerText = "😭😵😢";
    feedback.innerText = "Correct Answer: " + questions[currentQuestion].answer;
    feedback.classList.add("wrong");
    createBlast("😢");
  }
}

function nextQuestion(){
  currentQuestion++;
  if(currentQuestion < questions.length){
    loadQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz(){
  const players = JSON.parse(localStorage.getItem("smartQuizPlayers")) || [];
  players.push({ name: playerName, score: score });
  localStorage.setItem("smartQuizPlayers", JSON.stringify(players));

  const scoreEntry = {
    name: playerName,
    score,
    attempted: questions.length,
    timestamp: new Date().toISOString()
  };

  await sendScore(scoreEntry);

  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("finalScreen").classList.remove("hidden");

  document.getElementById("finalName").innerText = "Player: " + playerName;
  document.getElementById("finalScore").innerText = "Score: " + score + " / " + questions.length;
  document.getElementById("finalAttempted").innerText = "";
  document.getElementById("finalMessage").innerText = "Thank you from Harsha! 🎉😄🤣🥳";
}

async function sendScore(entry) {
  try {
    await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });
  } catch (error) {
    console.error('Failed to send score to server:', error);
  }
}

function showScores(){
  const board = document.getElementById("scoreboard");
  const btnFinal = document.getElementById("viewScoresFinalBtn");
  const players = JSON.parse(localStorage.getItem("smartQuizPlayers")) || [];

  if(board.classList.contains("hidden")){
    if(players.length === 0){
      board.innerHTML = '<p class="empty">No players have played yet.</p>';
    } else {
      let list = '<ul>';
      players.forEach((player, index) => {
        list += `<li>${index + 1}. ${player.name}: ${player.score}</li>`;
      });
      list += '</ul>';
      board.innerHTML = list;
    }
    board.classList.remove("hidden");
    if(btnFinal) btnFinal.innerText = "Hide Scores";
  } else {
    board.classList.add("hidden");
    if(btnFinal) btnFinal.innerText = "View Scores";
  }
}

function exitQuiz(){
  createEmojiShower();
  setTimeout(() => { window.location.href = "about:blank"; }, 2200);
}

function createEmojiShower(){
  const emojis = ["😈","😜","🤪","😂","🤣","😹","😆","😏"];
  for(let i = 0; i < 16; i++){
    const emoji = document.createElement("div");
    emoji.classList.add("falling-emoji");
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 90 + "%";
    emoji.style.fontSize = 50 + Math.random() * 80 + "px";
    emoji.style.animationDelay = (Math.random() * 0.5) + "s";
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 2400);
  }
}

function createBlast(emoji){
  const blast = document.createElement("div");
  blast.classList.add("blast");
  blast.innerText = emoji;
  blast.style.left = Math.random() * 80 + "%";
  blast.style.top = Math.random() * 80 + "%";
  document.body.appendChild(blast);
  setTimeout(() => { blast.remove(); },1000);
}

function createBlast(emoji){

  const blast =
    document.createElement("div");

  blast.classList.add("blast");

  blast.innerText = emoji;

  blast.style.left =
    Math.random() * 80 + "%";

  blast.style.top =
    Math.random() * 80 + "%";

  document.body.appendChild(blast);

  setTimeout(() => {

    blast.remove();

  },1000);

}

function addQuestion(){

  const q =
    document.getElementById("newQuestion").value;

  const a =
    document.getElementById("newAnswer").value;

  questions.push({

    question:q,
    answer:a

  });

  alert("Question Added!");

}