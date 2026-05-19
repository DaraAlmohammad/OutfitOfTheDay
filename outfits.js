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
export function addOutfitToMyPage(body) {
    let fileText = Deno.readTextFileSync("data.json");
    let data = JSON.parse(fileText);

    for (let key in body) {
        if (body[key] === "" || body[key] === undefined || body[key] === null) {
            return false;
        }
    }

    let foundSeason = null;

    for (let i = 0; i < data.seasons.length; i++) {
        if (data.seasons[i].season === body.seasonId) {
            foundSeason = data.seasons[i];
            break; 
        }
    }

    if (foundSeason == null) {
        return false; 
    }
    console.log(foundSeason);
    let newOutfit = {
        "id": data.outfits.length + 1,
        "color": body.color,
        "seasonId": foundSeason.id,
        "image": body.image,
        "description": body.description,
        "outfitType": body.outfitType,
        "isFavourite": false,
        "myOutfit": true
    };

    data.outfits.push(newOutfit);
    let updatedJson = JSON.stringify(data, null, 2);
    Deno.writeTextFileSync("data.json", updatedJson);

    return true;
}
export function myOutfits() {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);

    let myOutfits = [];

    for (let outfit of newData.outfits) {
        if (outfit.myOutfit == true) {
            myOutfits.push(outfit);
        }
    }
    return myOutfits; 
}