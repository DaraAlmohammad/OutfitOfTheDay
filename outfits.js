export function getAllOutfits() {
        let data = deno.readTextFilesync("data.json");
        let newData = JSON.parse(data);
        return newData.outfits;
    }

