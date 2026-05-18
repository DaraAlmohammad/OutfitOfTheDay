
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
            console.log("err")
        }
    }

    static async getMyOutfits() {
        let response = await fetch("/api/myoutfits");
        let jsonData = await response.json();
        return jsonData; 
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

    static init() { // döp om funktionen
        const addOutfitForm = document.getElementById("postOutfit-form");

        if (!addOutfitForm) return;

        addOutfitForm.addEventListener("submit", async function handleAddOutfit(event) {
            event.preventDefault();

            let data = JSON.stringify({
                image: addOutfitForm.elements.imageUrl.value,
                seasonId: addOutfitForm.elements.season.value,
                outfitType: addOutfitForm.elements.outfitType.value,
                color: addOutfitForm.elements.color.value,
                description: addOutfitForm.elements.description.value,
            });

            let options = {
                method: "POST",
                body: data,
                headers: { "Content-Type": "application/json" },
            };

            try {
                let response = await fetch("/OOTD/api/postOutfit", options)
                console.log(response);
                if (response.ok) {
                    alert("The outfit successfully posted!")
                } else {
                    console.log(response);
                }

            } catch (error) {
                console.log("Fel vid nätverksanrop:", error);
                alert("Network error, please try again");
            }
        })
    }
}

API.init();
