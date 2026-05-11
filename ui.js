function createAllOutfits() {
    let allOutfits = outfits.getAllOutfits(); 
    let outfitList = document.getElementById("outfit-feed-container");
    outfitList.innerHTML = "";

    for (let outfit of allOutfits) {
        let a = document.createElement("a");
        
        if (outfit.isFavourite === true) {
            a.innerHTML = `
            <img src="${outfit.image}">
            <img src="images/NotAFavorite.jpg">
        `
        } else {
            a.innerHTML = `
            <img src="${outfit.image}">
            <img src="images/favorite.jpg">
        `
        }
        outfitList.appendChild(a);
    }
}

createAllOutfits();