const loginForm = document.querySelector("#login-Box");
const registerForm = document.querySelector("#Register-Box");

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

    let response = await fetch("/OOTD/login", options);

    if (response.ok) {
        window.location.href = "/OOTD/mainpage.html";
    } else {
        alert("Inloggningen misslyckades. Kontrollera användarnamn och lösenord.");
    }
});

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

    let response = await fetch("/OOTD/register", options);
    
    if (response.ok) {
        window.location.href = "/OOTD/mainpage.html";
    } else {
        let result = await response.json();
        alert("Could not create new user: " + result.message);
    }
});
