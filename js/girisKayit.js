const firebaseConfig = {
    apiKey: "AIzaSyA1mrPoDxYnOQzT_jY5sViGApEovIiWe_E",
    authDomain: "evdeki-restoranim.firebaseapp.com",
    projectId: "evdeki-restoranim",
    storageBucket: "evdeki-restoranim.firebasestorage.app",
    messagingSenderId: "319407352503",
    appId: "1:319407352503:web:1e5582dddca28b3662fb32",
    measurementId: "G-NY6V7L1E8H"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => container.classList.add("active"));
loginBtn.addEventListener('click', () => container.classList.remove("active"));

function setupPasswordToggle(iconId, inputId) {
    const icon = document.getElementById(iconId);
    const input = document.getElementById(inputId);
    if (icon && input) {
        icon.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            icon.classList.toggle('bx-show');
            icon.classList.toggle('bx-hide');
        });
    }
}
setupPasswordToggle('toggleRegPasswordIcon', 'regPassword');
setupPasswordToggle('toggleLoginPasswordIcon', 'loginPassword');

window.signUpUser = async () => {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value;

    const nameError = document.getElementById('nameError');
    const passError = document.getElementById('passError');

    nameError.style.display = "none";
    passError.style.display = "none";

    const nameRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]{3,}$/;
    if (!nameRegex.test(name)) {
        nameError.style.display = "block";
        return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passRegex.test(pass)) {
        passError.style.display = "block";
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
        const user = userCredential.user;

        await user.updateProfile({ displayName: name });

        await db.collection("users").doc(user.uid).set({
            name: name,
            email: email,
            highScore: 0
        });

        await user.sendEmailVerification();
        alert("Kayıt başarılı! Lütfen mailinizi onaylayın.");
        container.classList.remove("active");

    } catch (error) {
        alert("Kayıt hatası: " + error.message);
    }
};

window.signInUser = async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, pass);
        if (userCredential.user.emailVerified) {
            window.location.href = "index.html";
        } else {
            alert("Lütfen e-posta adresinizi doğrulayın!");
            await auth.signOut();
        }
    } catch (error) {
        errorMsg.style.display = "block";
    }
};