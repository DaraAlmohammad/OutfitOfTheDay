class UI {
    async createAllOutfits(filteredList = null) {
        const outfitList = document.getElementById("outfit-feed-container");
        const statusContainer = document.getElementById("dom-status");

        outfitList.innerHTML = "";

        try {
            let outfitsToRender = filteredList;

            if (outfitsToRender === null) {
                outfitsToRender = await API.getAllOutfits();
            }

            for (let outfit of outfitsToRender) {
                const card = document.createElement("div");
                card.classList.add("outfit-card");

                let imagePath = outfit.image;
                if (!imagePath.startsWith("http")) {
                    imagePath = "../" + imagePath;
                }

                let heartSrc = "";
                if (outfit.isFavourite === true) {
                    heartSrc = "../images/favorite.jpg";
                } else {
                    heartSrc = "../images/NotAfavorite.jpg";
                }

                card.innerHTML = `
                <a href="detail.html?id=${outfit.id}" class="main-image-link">
                    <img src="${imagePath}" class="main-outfit-img">
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

        let imagePath = outfit.image;
        if (!imagePath.startsWith("http")) {
            imagePath = "../" + imagePath;
        }

        div.innerHTML = `
            <img src="${imagePath}" class="detail-outfit-img">
        
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

   setupFilterForm() {
        const filterForm = document.getElementById("filter-form");

        if (filterForm) {
            filterForm.addEventListener("submit", async function (event) {
                event.preventDefault();
                const statusContainer = document.getElementById("dom-status");

                try {
                    const seasonValue = document.getElementById("filter-season").value;
                    const colorValue = document.getElementById("filter-color").value;
                    const typeValue = document.getElementById("filter-outfit-type").value;

                    // här kontrollerar jag om vi är på mainpage eller myoutfits-sidan
                    let outfits;
                    if (document.querySelector(".my-outfits-page")) {
                        outfits = await API.getMyOutfits();
                    } else {
                        outfits = await API.getAllOutfits();
                    }
                   
                    //vilken radioknapp är itryckt!
                    const viewModeRadio = document.querySelector('input[name="viewMode"]:checked');
                    
                    if (viewModeRadio && viewModeRadio.value === "favorites") {
                        let favoriteOutfits = [];
                        for (let i = 0; i < outfits.length; i++) {
                            if (outfits[i].isFavourite === true) {
                                favoriteOutfits.push(outfits[i]);
                            }
                        }
                        outfits = favoriteOutfits; 
                    }

                    if (seasonValue !== "") {
                        outfits = API.getOutfitsInSeason(seasonValue, outfits);
                    }
                    if (colorValue !== "") {
                        outfits = API.getOutfitsByColor(colorValue, outfits);
                    }
                    if (typeValue !== "") {
                        outfits = API.getOutfitsByType(typeValue, outfits);
                    }

                    await ui.createAllOutfits(outfits);

                    if (statusContainer) {
                        statusContainer.style.display = "none";
                    }

                } catch (error) {
                    if (statusContainer) {
                        statusContainer.textContent = `Nätverksfel vid filtrering: ${error.message}`;
                        statusContainer.style.display = "block";
                    }
                }
            });
        }
    }

    async myOutfits() {
        let allMyOutfits = await API.getMyOutfits();
        console.log("Detta kommer från servern", allMyOutfits);
        let outfitList = document.getElementById("outfit-feed-container");

        if (!outfitList) return;

        outfitList.innerHTML = "";

        for (let outfit of allMyOutfits) {

            const card = document.createElement("div");
            card.classList.add("outfit-card");

            let imagePath = outfit.image;
            if (!imagePath.startsWith("http")) {
                imagePath = "../" + imagePath;
            }

            card.innerHTML = `
                <a href="detail.html?id=${outfit.id}" class="main-image-link">
                    <img src="${imagePath}" class="main-outfit-img">
                </a>
                    <button type="submit">Delete outfit</button>
            `;
            outfitList.appendChild(card);
        }
    }
}


const ui = new UI();

if (document.getElementById("outfit-feed-container") && !document.querySelector(".my-outfits-page")) ui.createAllOutfits();
if (document.querySelector(".my-outfits-page")) ui.myOutfits();
if (document.getElementById("outfit-detail-container")) ui.showOutfit();
if (document.getElementById("filter-form")) ui.setupFilterForm();
