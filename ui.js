class UI {
    async createAllOutfits() {
        const outfitList = document.getElementById("outfit-feed-container");
        const statusContainer = document.getElementById("dom-status");

        outfitList.innerHTML = "";

        try {
            const allOutfits = await Outfits.getAllOutfits();

            for (let outfit of allOutfits) {
                const card = document.createElement("div");
                card.classList.add("outfit-card");

                let heartSrc = "";
                if (outfit.isFavourite === true) {
                    heartSrc = "images/favorite.jpg";
                } else {
                    heartSrc = "images/NotAfavorite.jpg";
                }

                card.innerHTML = `
                <a href="detail.html?id=${outfit.id}" class="main-image-link">
                    <img src="${outfit.image}" class="main-outfit-img">
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
                            heartImg.src = "images/favorite.jpg";
                        } else {
                            heartImg.src = "images/NotAfavorite.jpg";
                        }

                        const response = await fetch(`/api/outfits/${outfit.id}`, {
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
    async showOutfit(id) {
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



UI.createAllOutfits;
