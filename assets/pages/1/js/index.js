import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZJvocXDQMXV77rnltyjtsnTm0Cz4vWR8",
  authDomain: "projeto-gr-7cd24.firebaseapp.com",
  projectId: "projeto-gr-7cd24",
  storageBucket: "projeto-gr-7cd24.appspot.com",
  messagingSenderId: "136857124362",
  appId: "1:136857124362:web:c4167a542ccc7fca99a9f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

// Get elements
const answerInput = document.getElementById("resposta");
const submitButton = document.getElementById("enviar");
const resultElement = document.getElementById("result");
const pontosElement = document.getElementById("pontos");

let pontos = 0;
let acertou = false;
let userId = null;

// Function to update points
function updatePoints() {
  pontos += 20;
  pontosElement.textContent = `${pontos} Pontos`;
  // Save points to Firebase
  set(ref(database, `users/${userId}/points`), {
    pontos: pontos,
  });
}

// Sign in anonymously and load points
signInAnonymously(auth)
  .then(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId = user.uid;
        loadUserData();
      }
    });
  })
  .catch((error) => {
    console.error("Error signing in anonymously:", error);
  });

// Load user data from Firebase
function loadUserData() {
  get(child(ref(database), `users/${userId}/points`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        pontos = snapshot.val().pontos;
        pontosElement.textContent = `${pontos} Pontos`;
      } else {
        console.log("No points data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  get(child(ref(database), `users/${userId}/acertou`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        acertou = snapshot.val().acertou;
      } else {
        console.log("No acertou data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Submit answer
submitButton.addEventListener("click", function () {
  const answer = answerInput.value.toLowerCase();
  if (answer === "beijo") {
    if (!acertou) {
      resultElement.textContent = "Resposta correta!";
      resultElement.style.color = "green";
      // Save to Firebase
      saveAnswer(answer);
      // Update points
      updatePoints();
      // Mark as answered correctly
      set(ref(database, `users/${userId}/acertou`), {
        acertou: true,
      });
    } else {
      resultElement.textContent = "Eu";
      resultElement.style.color = "blue";
    }
  } else {
    resultElement.textContent = "Resposta incorreta. Tente novamente!";
    resultElement.style.color = "red";
  }
});

// Save answer to Firebase
function saveAnswer(answer) {
  const newAnswerRef = push(ref(database, `users/${userId}/answers`));
  set(newAnswerRef, { answer });
}
