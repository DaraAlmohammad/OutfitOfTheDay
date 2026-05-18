
class API {

    static seasons = {
        1: "Summer",
        2: "Spring",
        3: "Winter",
        4: "Fall"
    };

    static async getAllOutfits() {
        try {
            let options = { credentials: "include" };
            let response = await fetch("/mainpage", options);
            let jsonData = await response.json();
            return jsonData;
        } catch (err) {
            console.log("hit kommer vi")
            console.log("err")
        }
    }

    static async getOutfitById(id) {
        let response = await fetch("/detail.html/" + id, {
            headers: { "Accept": "application/json" },
        });

        if (!response.ok) {
            return undefined;
        } else {
            const resource = await response.json();
            return resource;
        }
    }


    static getOutfitsInSeason(seasonId, allOutfits) {
        let filteredResults = [];
        for (let i = 0; i < allOutfits.length; i++) {
            if (allOutfits[i].seasonId === parseInt(seasonId)) { 
                filteredResults.push(allOutfits[i]);
            }
        }
        return filteredResults;
    }

    static getOutfitsByColor(color, allOutfits) {
        let filteredResults = [];
        for (let i = 0; i < allOutfits.length; i++) {
            if (allOutfits[i].color === color) { 
                filteredResults.push(allOutfits[i]);
            }
        }
        return filteredResults;
    }

    static getOutfitsByType(outfitType, allOutfits) {
        let filteredResults = [];
        for (let i = 0; i < allOutfits.length; i++) {
            if (allOutfits[i].outfitType === outfitType) { 
                filteredResults.push(allOutfits[i]);
            }
        }
        return filteredResults;
    }
}


