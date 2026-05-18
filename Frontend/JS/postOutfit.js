async function addOutfitToMyPage(body) {
    let fileText = await Deno.readTextFile("data.json");
    let data = JSON.parse(fileText);
    
    for (let key in body) {
        if (body.key === "" || body.key === undefined || body.key === null) {
           alert ("Something is missing, you have to in everything!")
        } return;
    }

    let newOutfit = {
        "id": API.allOutfits().length + 1,
        "color": body.color,
        "seasonId": body.season,
        "image": body.image,
        "description": body.description,
        "outfitType": body.outfitType,
        "isFavourite": false,
        "myOutfit": true
    };
    data.push(newOutfit);
    let updatedJson = JSON.stringify(data, null, 2);
    await Deno.writeTextFile("database.json", updatedJson);
}