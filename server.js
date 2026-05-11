import { serveDir } from "jsr:@std/http/file-server";
import { getOutfitById } from "./outfits.js";

async function handle(request) {
    let url = new URL(request.url);
    let idRouteOutfit = new URLPattern({ pathname: "/mainPage/:id"});
    let options = {
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "GET, POST, DELETE",
        }
    };

    if (url.pathname === "/mainPage" && request.method === "GET") {

        let data = await Deno.readTextFile("data.json");
        return new Response(data, {
            headers: { "Content-Type": "application/json" }
        });
    }

    if (url.pathname.startsWith("/login.html")) {
        return serveDir(request, { fsRoot: "." });
    }

    if (url.pathname == "/login" && url.method == "POST") {
        console.log(request)
        let user = await request.json();

        let data = Deno.readTextFile("users.json");
        JSON.stringify(data);
        for (let element of data) {
            if (element.username == user.username && element.password == user.password) {

                let options = {
                    headers: {
                        "Set-Cookie": `session_id=${crypto.randomUUID()}; Max-Age=86400`
                    }
                }

            }
        }
        console.log(crypto.randomUUID())

        return new Response("Welcome!", options)
    }

    if (idRouteOutfit.test(url)) {
        let match = idRouteOutfit.exec(url);
        let id = match.pathname.groups.id;
        let outfitById = getOutfitById(id);
        
        if (!outfitById) {
            options.status = 404;
            return new Response (JSON.stringify({error: "ID NOT FOUND"}), options);
        } else {
            options.status = 200; 
            return new Response (JSON.stringify(outfitById), options)
        }
    } 

    return serveDir(request, { fsRoot: "." });
}
Deno.serve(handle);