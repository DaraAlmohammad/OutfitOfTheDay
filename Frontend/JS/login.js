const loginForm = document.querySelector("#login-Box");
const registerForm = document.querySelector("#Register-Box");

// --- LOGGA IN ---
loginForm.addEventListener("submit", async function handleLogin(event) {
    event.preventDefault();

    let data = JSON.stringify({
        username: loginForm.elements.username.value,
        password: loginForm.elements.password.value
    });
    
    let options = {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
        credentials: "include" 
    };
    
    let response = await fetch("/login", options);

    if (response.ok) {
        window.location.href = "/html/mainpage.html";
    } else {
        alert("Inloggningen misslyckades. Kontrollera användarnamn och lösenord.");
    }
});

// --- REGISTRERA NY ANVÄNDARE ---
registerForm.addEventListener("submit", async function handleRegister(event) {
    event.preventDefault();

    let data = JSON.stringify({
        username: registerForm.elements.createUser.value,
        password: registerForm.elements.createPassword.value
    });
    
    let options = {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
        credentials: "include" 
    };
    
    let response = await fetch("/register", options);

    if (response.ok) {
        // Om kontot skapas loggas vi in direkt och skickas till mainpage
        window.location.href = "/html/mainpage.html";
    } else {
        let result = await response.json();
        alert("Kunde inte skapa användare: " + result.message);
    }
});