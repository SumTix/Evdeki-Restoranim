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
const provider = new firebase.auth.GoogleAuthProvider();

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

document.getElementById('signUpForm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); signUpUser(); }
});
document.getElementById('signInForm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); signInUser(); }
});

// --- FIREBASE ---
window.signInWithGoogle = async () => {
    try {
        await auth.signInWithPopup(provider);
        window.location.href = "homepage.html";
    } catch (error) {
        console.error("Google hatası:", error.message);
        alert("Google ile giriş yapılamadı.");
    }
};

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
        await userCredential.user.updateProfile({ displayName: name });
        
        await userCredential.user.sendEmailVerification();
        
        alert("Kayıt başarılı! Lütfen e-posta kutunuzu kontrol edin ve hesabınızı doğrulayın. Onay vermeden giriş yapamazsınız.");
        
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
        const user = userCredential.user;

        if (user.emailVerified) {
            errorMsg.style.display = "none";
            window.location.href = "homepage.html";
        } else {
            alert("Hesabınız doğrulanmamış! Lütfen mailinize gelen linke tıklayın.");
            await auth.signOut(); 
        }

    } catch (error) {
        errorMsg.style.display = "block";
        console.error("Giriş hatası:", error.code);
    }
};

document.getElementById('forgotPassword').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();

    if (!email) {
        alert("Lütfen şifresini sıfırlamak istediğiniz e-posta adresini 'E-posta' alanına yazın.");
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);
        alert("Şifre sıfırlama bağlantısı e-postanıza gönderildi! Lütfen kontrol edin.");
    } catch (error) {
        let message = "Bir hata oluştu.";
        if (error.code === "auth/user-not-found") message = "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.";
        if (error.code === "auth/invalid-email") message = "Geçersiz bir e-posta adresi girdiniz.";
        alert(message);
    }
});