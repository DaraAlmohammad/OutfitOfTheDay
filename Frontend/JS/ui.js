class UI {
    async createAllOutfits() {
        const outfitList = document.getElementById("outfit-feed-container");
        const statusContainer = document.getElementById("dom-status");

        outfitList.innerHTML = "";

        try {
            const allOutfits = await API.getAllOutfits();

            for (let outfit of allOutfits) {
                const card = document.createElement("div");
                card.classList.add("outfit-card");

                let heartSrc = "";
                if (outfit.isFavourite === true) {
                    heartSrc = "../images/favorite.jpg";
                } else {
                    heartSrc = "../images/NotAfavorite.jpg";
                }

                card.innerHTML = `
                <a href="detail.html?id=${outfit.id}" class="main-image-link">
                    <img src="../${outfit.image}" class="main-outfit-img">
                </a>
                <button class="favorite-btn">
                    <img src="${heartSrc}" class="heart-icon">
                </button>
            `;

                const heartBtn = card.querySelector(".favorite-btn");
                const heartImg = card.querySelector(".heart-icon");

                heartBtn.addEventListener("click", async function () {
                    try {
                        outfit.isFavourite = !outfit.isFavourite;

                        if (outfit.isFavourite === true) {
                            heartImg.src = "../images/favorite.jpg";
                        } else {
                            heartImg.src = "../images/NotAfavorite.jpg";
                        }

                        const response = await fetch(`/mainpage/outfits/${outfit.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ isFavourite: outfit.isFavourite })
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP fel! Status: ${response.status}`);
                        }
                    } catch (error) {
                        if (statusContainer) {
                            statusContainer.textContent = `Fel: ${error.message}`;
                            statusContainer.style.display = "block";
                        }
                    }
                });

                outfitList.appendChild(card);
            }
        } catch (error) {
            if (statusContainer) {
                statusContainer.textContent = `Nätverksfel: ${error.message}`;
                statusContainer.style.display = "block";
            }



        }
    }
    async showOutfit() {
        const params = new URLSearchParams(window.location.search);
        const outfitId = params.get("id");
        const outfit = await API.getOutfitById(outfitId)
        if (outfit == undefined) {
            return;
        }

        let outfitById = document.getElementById("outfit-detail-container");
        let div = document.createElement("div");
        div.classList.add("detail-card");

        div.innerHTML = `
            <img src="../${outfit.image}" class="detail-outfit-img">
        
            <div class="detail-info-row">
                <h3>Color: <span>${outfit.color}</span></h3>
                <h3>Season: <span>${API.seasons[outfit.seasonId]}</span></h3>
                <h3>Type: <span>${outfit.outfitType}</span></h3>
            </div>

            <div class="detail-description">
                <h3>Description:</h3>
                <p>${outfit.description || "Ingen beskrivning tillgänglig."}</p>
            </div>
        `;
        outfitById.appendChild(div);
    }
    async addOutfitToMyPage() {
    let allOutfits = await API.getAllOutfits();

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
    // myOutfits.push(newOutfit)        den nya outfiten ska läggas till på myPage också, fixa när vi har den funktionen!
}
}

const ui = new UI();
if (document.getElementById("outfit-feed-container")) ui.createAllOutfits();
if (document.getElementById("outfit-detail-container")) ui.showOutfit();
