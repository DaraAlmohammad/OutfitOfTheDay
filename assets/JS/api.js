
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
