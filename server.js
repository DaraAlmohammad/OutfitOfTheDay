import { getUserByname } from "./api.js";
async function handle(request) {
    let url = new URL(request.url);
    if (url.pathname == "/login" && request.method == "POST") {
        let user = await request.json();

        let data = Deno.readTextFile("users.json");
        for (let element of data) {
            if (element.username == user.username && element.password == user.password) {

                let options = {
                    headers: {
                        "Set-Cookie": `session_id=${crypto.randomUUID()}; Max-Age=86400`
                    }
                }
                return new Response("Welcome!", options)

            }
        }
    }
}