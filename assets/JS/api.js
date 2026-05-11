
class API{

    static async getAllOutfits() {
        try{
            let response = await fetch("/mainpage");
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
        let finalData = JSON.stringify(newData);
        Deno.writeTextFileSync("data.json",finalData)
    }

    static async getOutfitById(id) {
        let response = fetch("mainpage/id" + id, {
            headers: {"Accept": "application/json"},
        });
        
        if (!response.ok) {
            return undefined; 
        } else {
            const resource = await response.json();
            return resource;  
        }
    }
}
