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
const form = document.querySelector("#filter-form");
form.addEventListener("submit", async function (){
    const outfits = Outfits.getAllOutfits();
    const form = document.querySelector("#filter-form");
    const color = form.elements.color.value;

    let filterdOutfits = [];
    for(let element of outfits){
        if(element.color == color){
            filterdOutfits.push(element);
        }
    }
    return filterdOutfits;

})


createAllOutfits();