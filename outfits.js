class Outfits{

     static async getAllOutfits() {
        try{
            let response = await fetch("/api/outfits");
            let jsonData = await response.json();
            return jsonData.outfits;
        } catch(err){
            console.log("err")
        }
        }
    static deleteProduct(id){
        let data = deno.readTextFilesync("data.json");
        let newData = JSON.parse(data);
        for (let i = 0; i < newData.outfits.length; i++){
            if(newData.outfits[i].id == id){
                newData.outfits.splice(i,1);
            }
        }
        let finelData = JSON.stringify(newData);
        Deno.writeTextFileSync("data.json",finelData)
    }
}
