export function getAllOutfits() {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);
    return newData.outfits;
}
export function getOutfitById(id) {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);

    for (let outfit of newData.outfits) {
        if (id == outfit.id) {
            return outfit;
        }
    }
    return false;
}
export function deleteProduct(id) {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);
    for (let i = 0; i < newData.outfits.length; i++) {
        if (newData.outfits[i].id == id) {
            newData.outfits.splice(i, 1);
        }
    }
    let finalData = JSON.stringify(newData);
    Deno.writeTextFileSync("data.json", finalData)
}

export function addOutfitToMyPage() {
    let allOutfits = API.getAllOutfits();

    let valueImg = document.getElementById("image-url").value;
    let valueSeason = document.getElementById("season").value;
    let valueOutfitType = document.getElementById("outfit-type").value;
    let valueColor = document.getElementById("color").value;
    let valueDescription = document.getElementById("description").value;

    if (valueImg === "") {
        let imgSquare = document.getElementById("image-url");
        imgSquare.style.border = "2px solid red";
    }
    if (valueSeason == "") {
        let seasonSquare = document.getElementById("season");
        seasonSquare.border = "2px solid red";
    }
    if (valueOutfitType == "") {
        let outfitTypeSquare = document.getElementById("outfit-type");
        outfitTypeSquare.border = "2px solid red";
    }
    if (valueColor == "") {
        let colorSquare = document.getElementById("color");
        colorSquare.border = "2px solid red";
    }
    if (valueDescription == "") {
        let descriptionSquare = document.getElementById("description");
        descriptionSquare.border = "2px solid red";
    }

    let newOutfit = {
        "id": allOutfits.length + 1,
        "color": valueColor,
        "seasonId": valueSeason,
        "image": valueImg,
        "description": valueDescription,
        "outfitType": valueOutfitType,
        "isFavourite": false,
        "myOutfit": true
    };
    allOutfits.push(newOutfit);
    // myOutfits.oush(newOutfit)        den nya outfiten ska läggas till på myPage
}
