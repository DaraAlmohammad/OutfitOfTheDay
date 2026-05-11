export function getAllOutfits() {
        let data = deno.readTextFilesync("data.json");
        let newData = JSON.parse(data);
        return newData.outfits;
    }
export function deleteProduct(id){
    let data = deno.readTextFilesync("data.json");
    let newData = JSON.parse(data);
    for (let i = 0; i < newData.outfits.length; i++){
        if(newData.outfits[i].id == id){
            newData.products.splice(i,1);
        }
    }
    let finelData = JSON.stringify(newData);
    Deno.writeTextFileSync("data.json",finelData)
}
