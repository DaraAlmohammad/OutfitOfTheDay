export function getOutfitById(id) {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);

    for (let outfit of newData) {
        if (id === newData.id) {
            return outfit;
        } 
    }
    return false; 
}