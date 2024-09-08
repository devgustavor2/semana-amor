import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { child, get, getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

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

// Obter elemento da página
const pontosElement = document.getElementById("pontos");

// Função para carregar dados do usuário do Firebase
function loadUserData(userId) {
  get(child(ref(database), `users/${userId}/questions`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let totalPontos = 0;
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          totalPontos += data.pontos || 0;
          console.log(totalPontos)
        });
        pontosElement.textContent = `${totalPontos} Pontos`;
      } else {
        pontosElement.textContent = "Nenhuma pontuação disponível";
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados:", error);
      pontosElement.textContent = "Erro ao carregar a pontuação";
    });
}

// Carregar dados do usuário ao iniciar
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    loadUserData(userId);
  } else {
    pontosElement.textContent = "Nenhum usuário autenticado";
  }
});
