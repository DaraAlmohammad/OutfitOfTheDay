import { serveDir } from "jsr:@std/http/file-server";
import { getOutfitById, getAllOutfits } from "./outfits.js";

function getUsers() {
    try {
        let data = Deno.readTextFileSync("users.json");
        return JSON.parse(data);
    } catch (err) {
        console.log("Kunde inte läsa in users");
        return { users: [] }; // Tillagd fallback ifall filen är tom
    }
}

function saveUsers(userData) {
    Deno.writeTextFileSync("users.json", JSON.stringify(userData, null, 4));
}

async function handle(request) {
    let url = new URL(request.url);
    let idRouteOutfit = new URLPattern({ pathname: "/detail.html/:id" });

    // --- 1. KOLLA COOKIES ---
    const cookies = request.headers.get("cookie");
    let currentSessionId = null;
    
    if (cookies != null && cookies.includes("session_id=")) {
        let cookieArray = cookies.split("; ");
        for (let i = 0; i < cookieArray.length; i++) {
            let currentCookie = cookieArray[i];
            if (currentCookie.startsWith("session_id=")) {
                currentSessionId = currentCookie.split("=")[1];
            }
        }
    }

    let usersData = getUsers();
    let loggedInUser = null;
    
    if (currentSessionId != null) {
        for (let i = 0; i < usersData.users.length; i++) {
            if (usersData.users[i].sessionId === currentSessionId) {
                loggedInUser = usersData.users[i];
            }
        }
    }
    
    let isLoggedIn = (loggedInUser != null);

    // --- 2. SKYDDA SIDOR ---
    const protectedPages = ["/mainpage.html", "/myOutfits.html", "/postOutfit.html", "/detail.html"];
    if (protectedPages.includes(url.pathname)) {
        if (isLoggedIn === false) {
            let redirectOptions = {
                status: 303,
                headers: { "Location": "/login.html" }
            };
            return new Response("", redirectOptions);
        }
    }

    // --- 3. REGISTRERA 
    if (url.pathname === "/register" && request.method === "POST") {
        let body = await request.json();
        let userExists = false;
        
        for (let i = 0; i < usersData.users.length; i++) {
            if (usersData.users[i].username === body.username) {
                userExists = true;
            }
        }
        
        if (userExists == true) {
            return new Response(JSON.stringify({ success: false, message: "Användare finns redan" }), { status: 400 });
        }
        
        let newSessionId = crypto.randomUUID();
        let newUser = {
            username: body.username,
            password: body.password,
            sessionId: newSessionId
        }
        
        usersData.users.push(newUser);
        saveUsers(usersData);
        
        let registerOptions = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": "session_id=" + newSessionId + "; Max-Age=86400; Path=/"
            }
        };
        return new Response(JSON.stringify({ success: true }), registerOptions);
    }

    // --- 4. LOGGA IN 
    if (url.pathname === "/login" && request.method === "POST") {
        let body = await request.json();
        let foundUser = null;

        for (let i = 0; i < usersData.users.length; i++) {
            if (usersData.users[i].username === body.username && String(usersData.users[i].password) === String(body.password)) {
                foundUser = usersData.users[i];
            }
        }
        
        if (foundUser != null) {
            let newSessionId = crypto.randomUUID();
            foundUser.sessionId = newSessionId;
            saveUsers(usersData);

            let loginOptions = {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": "session_id=" + newSessionId + "; Max-Age=86400;"
                }
            };
            return new Response(JSON.stringify({ success: true }), loginOptions);
        } else {
            return new Response(JSON.stringify({ success: false, message: "Fel uppgifter" }), { status: 401 });
        }
    }

    let options = {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "GET, POST, DELETE, PATCH",
        }
    };

    if (url.pathname === "/mainpage" && request.method === "GET") {
        if (isLoggedIn == false) {
            return new Response("Unauthorized", { status: 401 });
        }

        let outfits = getAllOutfits();
        return new Response(JSON.stringify(outfits), {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (idRouteOutfit.test(url)) {
        let match = idRouteOutfit.exec(url);
        let id = match.pathname.groups.id;
        let outfitById = getOutfitById(id);

        if (!outfitById) {
            options.status = 404;
            return new Response(JSON.stringify({ error: "ID NOT FOUND" }), options);
        } else {
            options.status = 200;
            return new Response(JSON.stringify(outfitById), options)
        }
    }

    
    return serveDir(request, { fsRoot: "./Frontend" }); 
}

Deno.serve(handle);