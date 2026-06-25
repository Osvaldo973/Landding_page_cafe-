// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// =========================================================================
// REEMPLAZA ESTE OBJETO CON LAS CREDENCIALES DE TU PROPIA CONSOLA DE FIREBASE
// (Sigue los pasos 1 y 2 de la guía firebase_instructions.md)
// =========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyCtbGx7-36O2BOgjtz1gPbgbhdLxxBkjnU",
    authDomain: "pagina-de-cafe.firebaseapp.com",
    projectId: "pagina-de-cafe",
    storageBucket: "pagina-de-cafe.firebasestorage.app",
    messagingSenderId: "379568098555",
    appId: "1:379568098555:web:8d04f27bbf99627d64f45e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
