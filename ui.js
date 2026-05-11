async function createAllOutfits() {
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

createAllOutfits();