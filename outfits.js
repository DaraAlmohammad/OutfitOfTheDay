export function getAllOutfits(){
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);
    return newData.outfits;
}
export function getOutfitById(id) {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);

    for (let outfit of newData.outfits) {
        if (id == outfit.id) {
            return outfit;
        } 
    }
    return false; 
}
export function deleteProduct(id){
        let data = Deno.readTextFileSync("data.json");
        let newData = JSON.parse(data);
        for (let i = 0; i < newData.outfits.length; i++){
            if(newData.outfits[i].id == id){
                newData.outfits.splice(i,1);
            }
        }
        let finalData = JSON.stringify(newData);
        Deno.writeTextFileSync("data.json",finalData)
}
