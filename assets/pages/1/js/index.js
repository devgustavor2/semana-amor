import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { child, get, getDatabase, push, ref, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZJvocXDQMXV77rnltyjtsnTm0Cz4vWR8",
  authDomain: "projeto-gr-7cd24.firebaseapp.com",
  projectId: "projeto-gr-7cd24",
  storageBucket: "projeto-gr-7cd24.appspot.com",
  messagingSenderId: "136857124362",
  appId: "1:136857124362:web:c4167a542ccc7fca99a9f3",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Obter elementos da página
const answerInput = document.getElementById("resposta");
const submitButton = document.getElementById("enviar");
const resultElement = document.getElementById("result");
const pontosElement = document.getElementById("pontos");

const questionId = "question1"; // Identificador da pergunta
let pontos = 0;
let acertou = false;
const userId = localStorage.getItem("userId");

// Carregar dados do usuário do Firebase
function loadUserData() {
  get(child(ref(database), `users/${userId}/questions/${questionId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        pontos = data.pontos || 0;
        acertou = data.acertou || false;
        pontosElement.textContent = `${pontos} Pontos`;
      } else {
        console.log("Nenhum dado disponível para a pergunta");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados:", error);
    });
}

// Função para atualizar pontos
function updatePoints() {
  pontos += 40;
  pontosElement.textContent = `${pontos} Pontos`;
  set(ref(database, `users/${userId}/questions/${questionId}`), {
    pontos,
    acertou
  })
  .catch((error) => {
    console.error("Erro ao atualizar pontos:", error);
  });
}


// Verificar resposta do quiz
submitButton.addEventListener("click", () => {
  const answer = answerInput.value.toLowerCase();
  if (answer === "beija-flor") {
    if (!acertou) {
      resultElement.textContent = "Resposta correta!";
      resultElement.style.color = "green";
      saveAnswer(answer);
      updatePoints();
      set(ref(database, `users/${userId}/questions/${questionId}`), { acertou: true });
    } else {
      resultElement.textContent = "Você já acertou este enigma!";
      resultElement.style.color = "blue";
    }
    window.location.href = '../../pages/menu/menu.html';
  } else {
    resultElement.textContent = "Resposta incorreta.";
    resultElement.style.color = "red";
  }
});

// Salvar resposta no Firebase
function saveAnswer(answer) {
  const newAnswerRef = push(ref(database, `users/${userId}/questions/${questionId}/answers`));
  set(newAnswerRef, { answer });
}

// Carregar dados do usuário ao iniciar
if (userId) {
  loadUserData();
} else {
  console.error("Nenhum usuário autenticado.");
}
