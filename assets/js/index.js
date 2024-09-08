import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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

// Obter os elementos de entrada de email e senha
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

// Função de login com email e senha
document.querySelector('#loginForm').addEventListener('submit', (event) => {
  event.preventDefault();  // Prevenir o envio padrão do formulário

  // Extrair os valores dos campos de entrada
  const email = emailInput.value;
  const password = passwordInput.value;

  // Fazer login com email e senha
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userId = user.uid; // Salva o userId após o login
      console.log("Usuário logado:", user);

      // Salvar UID no localStorage
      localStorage.setItem("userId", userId);

      // Verifica se o usuário foi autenticado antes de redirecionar
      console.log("Redirecionando para menu.html...");
      window.location.href = 'assets/pages/menu/menu.html';  // Ajuste o caminho conforme necessário
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erro ao fazer login:", errorCode, errorMessage);
    });
});

// Verificar autenticação quando o estado mudar
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário está logado.");
  } else {
    console.log("Usuário não está logado.");
  }
});
