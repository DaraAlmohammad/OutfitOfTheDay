import { serveDir } from "jsr:@std/http/file-server";

async function handle(request) {
    let url = new URL(request.url);
    if (url.pathname === "/mainPage" && request.method === "GET") {
    
    let data = await Deno.readTextFile("data.json");
    return new Response(data, {
        headers: { "Content-Type": "application/json" }
    });
}

if (url.pathname.startsWith("/login.html")) {
    return serveDir(request,{fsRoot:"."});
}

if (url.pathname == "/login" && url.method=="POST") {
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
return serveDir(request, { fsRoot: "." });
}
Deno.serve(handle);