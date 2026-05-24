import { serveDir } from "jsr:@std/http/file-server";
import { extname } from "jsr:@std/path";
import { getOutfitById, getAllOutfits, deleteOutfit, addOutfitToMyPage, myOutfits, updateFavoriteStatus } from "./outfits.js";

let options = {
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "GET, POST, DELETE, PATCH",
    }
};

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
    let idRouteOutfit = new URLPattern({ pathname: "/OOTD/detail/:id" });
    let patchRouteOutfit = new URLPattern({ pathname: "/OOTD/mainpage/outfits/:id" });
    let deleteRouteOutfit = new URLPattern({ pathname: "/OOTD/myoutfits/:id" });

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
    const protectedPages = ["/OOTD/mainpage.html", "/OOTD/myOutfits.html", "/OOTD/postOutfit.html", "/OOTD/detail.html",];
    if (protectedPages.includes(url.pathname)) {
        if (isLoggedIn === false) {
            let redirectOptions = {
                status: 303,
                headers: { "Location": "/OOTD/login.html" }
            };
            return new Response("", redirectOptions);
        }
    }
    // --- 3. REGISTRERA 
    if (url.pathname === "/OOTD/register" && request.method === "POST") {
        let body = await request.json();
        let userExists = false;

        for (let i = 0; i < usersData.users.length; i++) {
            if (usersData.users[i].username === body.username) {
                userExists = true;
            }
        }

        if (userExists == true) {
            return new Response(JSON.stringify({ success: false, message: "User already exist" }), { status: 400 });
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
                "Set-Cookie": "session_id=" + newSessionId + "; Max-Age=86400; Path=/;"
            }
        };
        return new Response(JSON.stringify({ success: true }), registerOptions);
    }

    // --- 4. LOGGA IN 
    if (url.pathname === "/OOTD/login" && request.method === "POST") {
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
                    "Set-Cookie": "session_id=" + newSessionId + "; Max-Age=86400; Path=/"
                }
            };
            return new Response(JSON.stringify({ success: true }), loginOptions);
        } else {
            return new Response(JSON.stringify({ success: false, message: "Fel uppgifter" }), { status: 401 });
        }
    }
    // --- LOGGA UT ---
    if (url.pathname === "/logout") {
        let logoutOptions = {
            status: 303, // Omdirigering
            headers: {
                "Location": "/OOTD/login.html", // Ändra till /login.html om filen inte ligger i en html-mapp
                "Set-Cookie": "session_id=deleted; Max-Age=0; Path=/" // Raderar cookien
            }
        };
        return new Response("", logoutOptions);
    }

    if (url.pathname === "/OOTD/myoutfits" && request.method === "GET") {
        
        let showMyOutfits = myOutfits(loggedInUser.username);
        
        return new Response(JSON.stringify(showMyOutfits), {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (url.pathname === "/OOTD/mainpage" && request.method === "GET") {
        if (isLoggedIn == false) {
            return new Response("Unauthorized", { status: 401 });
        }

        let customOutfits = getAllOutfits();

        for (let i = 0; i < customOutfits.length; i++) {
            let outfit = customOutfits[i];
            let userHasFavorited = false;

            if (outfit.favoritedBy && outfit.favoritedBy.includes(loggedInUser.username)) {
                userHasFavorited = true;
            }

            outfit.isFavourite = userHasFavorited;
        }
        return new Response(JSON.stringify(customOutfits), {
            headers: { "Content-Type": "application/json" },
        });
    }

    // Acceptera post-request 
    if (request.method === "POST" && url.pathname === "/OOTD/postoutfit") {

        let formData = await request.formData();

        const file = formData.get("file");
        const originalName = file.name;
        const newName = crypto.randomUUID();
        extname(originalName);
        const extention = extname(originalName);
        const newFilename = newName + extention;

        let bodyText = {
            seasonId: formData.get("season"),
            outfitType: formData.get("outfitType"),
            color: formData.get("color"),
            description: formData.get("description"),
            image: "images/" + newFilename // Sätter sökvägen så den pekar rätt på mainpage
        };

        if ((file && file.size > 0) && (file && file.size < 500000)) {
            const bytes = await file.bytes();
            await Deno.writeFile(`./Frontend/images/${newFilename}`, bytes);

        } else {
            return new Response(JSON.stringify({ message: "Bad request" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }
        let fulfilledRequest = addOutfitToMyPage(bodyText, loggedInUser.username);

        if (!fulfilledRequest ) {
            return new Response(JSON.stringify({ message: "Bad request" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }
        return new Response(null, {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

    }

    if (request.method === "DELETE" && deleteRouteOutfit.test(url)) {
        let match = deleteRouteOutfit.exec(url);
        let deleteId = parseInt(match.pathname.groups.id);

        deleteOutfit(deleteId);

        return new Response(JSON.stringify({ message: "Outfit deleted!" }), options);
    }

    if (request.method === "GET" && idRouteOutfit.test(url)) {
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

    if (request.method === "PATCH" && patchRouteOutfit.test(url)) {
        let match = patchRouteOutfit.exec(url);
        let outfitId = parseInt(match.pathname.groups.id);

        let bodyText = await request.text();
        let body = JSON.parse(bodyText);

        updateFavoriteStatus(outfitId, body, loggedInUser.username)

        return new Response(JSON.stringify({ message: "Updated!" }), options);
    }

    return serveDir(request, { fsRoot: "./Frontend" });
}

Deno.serve(handle);