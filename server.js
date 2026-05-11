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