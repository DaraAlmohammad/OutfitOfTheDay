class UI {
    async createAllOutfits() {
        let outfitList = document.getElementById("outfit-feed-container");
        outfitList.innerHTML = "";
        let allOutfits = await Outfits.getAllOutfits();
        console.log(allOutfits);

        for (let outfit of allOutfits) {
            let a = document.createElement("a");

            if (outfit.isFavourite === true) {
                a.innerHTML = `
            <img src="${outfit.image}">
            <img src="images/favorite.jpg">
        `
            } else {
                a.innerHTML = `
            <img src="${outfit.image}">
            <img src="images/NotAfavorite.jpg">
        `
            }
            outfitList.appendChild(a);
        }
    }
    async showOutfit() {
        const params = new URLSearchParams(windows.location.search);
        const outfitId = params.get("id");
        const outfit = await API.getOutfitById(outfitId)

        let outfitById = document.getElementById("outfit-detail-container");
        let div = document.createElement("div");

        div.innerHTML = `
            <img src=${outfit.image}>,
            <h2>${outfit.color}</h2>, 
            <h2>${outfit.outfitType}</h2>,
            <p>${outfit.description}</p>,
        `
    }
}

createAllOutfits();