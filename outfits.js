export function getAllOutfits() {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);
    let seasons = newData.seasons;
    let outfitTypes = newData.outfitTypes;

    for (let element of newData.outfits) {
        for (let season of seasons) {
            if (element.seasonId === season.id) {
                element.season = season.season;
            }

        }

        for (let outfitType of outfitTypes) {

            if (element.outfitTypeId === outfitType.id) {
                element.outfitType = outfitType.type;
            }
        }
    }
    return newData.outfits;
}

export function getOutfitById(id) {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);
    let seasons = newData.seasons;
    let outfitTypes = newData.outfitTypes;

    for (let element of newData.outfits) {
        for (let season of seasons) {
            if (element.seasonId === season.id) {
                element.season = season.season;
            }

        }
        for (let outfitType of outfitTypes) {

            if (element.outfitTypeId === outfitType.id) {
                element.outfitType = outfitType.type;
            }
        }
    }
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
export function addOutfitToMyPage(body, username) {
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

    let newOutfit = {
        "id": data.outfits.length + 1,
        "color": body.color,
        "seasonId": foundSeason.id,
        "image": body.image,
        "description": body.description,
        "outfitType": body.outfitType,
        "favoritedBy": [],
        "username": username
    };

    data.outfits.push(newOutfit);
    let updatedJson = JSON.stringify(data, null, 2);
    Deno.writeTextFileSync("data.json", updatedJson);

    return true;
}
export function myOutfits(username) {
    let data = Deno.readTextFileSync("data.json");
    let newData = JSON.parse(data);

    let myOutfits = [];

    for (let outfit of newData.outfits) {

        if (outfit.username === username) {
            myOutfits.push(outfit);
        }
    }
    return myOutfits;
}

export function updateFavoriteStatus(id, body, username) {
    let fileText = Deno.readTextFileSync("data.json");

    let data = JSON.parse(fileText);

    for (let outfit of data.outfits) {
        if (outfit.id === id) {
            outfit.isFavourite = body.isFavourite;

            if (!outfit.favoritedBy) {
                outfit.favoritedBy = [];
            }
            if (body.isFavourite === true) {
                if (!outfit.favoritedBy.includes(username)) {
                    outfit.favoritedBy.push(username);
                }
            } else {
                for (let i = 0; i < outfit.favoritedBy.length; i++) {
                    if (outfit.favoritedBy[i] === username) {
                        outfit.favoritedBy.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    let updatedJson = JSON.stringify(data, null, 2);
    Deno.writeTextFileSync("data.json", updatedJson);
}