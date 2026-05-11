function getUserByname(name){
let data = Deno.readTextFileSync("users.json");
    for(let element of data){
        if(element.username == name){
            return element;
        }
    }
}