
class API {

    static async getAllOutfits() {
        try {
            let options = { credentials: "include" };
            let response = await fetch("/OOTD/mainpage", options);
            let jsonData = await response.json();
            return jsonData;
        } catch (err) {
            console.error("Error fetching outfits:", err);
            alert("Could not load outfits. Please try again later.");
        }
    }

    static async getMyOutfits() {
        let response = await fetch("/OOTD/myoutfits");
        let jsonData = await response.json();
        return jsonData; 
    }
    static async getOutfitById(id) {
        let response = await fetch("/OOTD/detail/" + id, {
            headers: { "Accept": "application/json" },
        });

        if (!response.ok) {
            return undefined;
        } else {
            const resource = await response.json();
            return resource;
        }
    }

    static async deleteOutfit(id) {
        let options = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        };
        
        let response = await fetch("/OOTD/myoutfits/" + id, options);
        return response.ok;
    }
    static async updateFavorite(id, isFavourite) {
        try {
            let options = {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFavourite: isFavourite })
            };
            
            let response = await fetch(`/OOTD/mainpage/outfits/${id}`, options);
            
            if (!response.ok) {
                throw new Error(`HTTP fel! Status: ${response.status}`);
            }
            return true; 
        } catch (error) {
            console.error("Error updating favorite:", error);
            alert("Failed to update favorite. Please try again.");
            return false;
        }
    }
    static submitPostoutfit() { 
        const addOutfitForm = document.getElementById("postOutfit-form");

        if (!addOutfitForm) return;

        addOutfitForm.addEventListener("submit", async function handleAddOutfit(event) {
            event.preventDefault();
            
            const formData = new FormData(addOutfitForm);
            let options = {
                method: "POST",
                body: formData,
            };

            try {
                let response = await fetch("/OOTD/postoutfit", options)
                console.log(response);
                if (response.ok) {
                    alert("The outfit successfully posted!")
                    addOutfitForm.reset();
                } else {
                    alert("Could not post outfit");
                }

            } catch (error) {
                console.error("Post error:", error);
                alert("Network error, please try again.");
            }
        })
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

API.submitPostoutfit();
