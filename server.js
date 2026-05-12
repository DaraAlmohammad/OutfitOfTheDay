import { serveDir } from "jsr:@std/http/file-server";
import { getOutfitById, getAllOutfits} from "./outfits.js";

async function handle(request) {
    let url = new URL(request.url);
    let idRouteOutfit = new URLPattern({ pathname: "/mainpage/:id"});
    let options = {
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "GET, POST, DELETE, PATCH",
        }
    };

    if (url.pathname === "/mainpage" && request.method === "GET") {

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
            return new Response (JSON.stringify({error: "ID NOT FOUND"}), options);
        } else {
            options.status = 200; 
            return new Response (JSON.stringify(outfitById), options)
        }
    } 

    return serveDir(request, { fsRoot: "./Frontend/html" });
}
Deno.serve(handle);