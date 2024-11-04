let petsData = [];

const showLoading = () => {
    const loadingContainer = document.getElementById("loading-container");
    const petsContainer = document.getElementById("pets-card");

    loadingContainer.classList.remove("hidden");
    petsContainer.classList.add("hidden");

    setTimeout(() => {
        loadingContainer.classList.add("hidden");
        petsContainer.classList.remove("hidden");
    }, 2000);
};

const loadCategories = async () => {
    const response = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
    const data = await response.json();
    displayCategories(data.categories);
};

const loadPets = async () => {
    const response = await fetch("https://openapi.programming-hero.com/api/peddy/pets");
    const data = await response.json();
    showLoading();
    displayPets(data.pets);

    // stored data for default sorting
    petsData = data.pets;
};

const loadPetsByName = async (name) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${name}`);
    const typeData = await response.json();

    // inactive all button
    const buttons = document.getElementsByClassName("category-btn");
    console.log(buttons);
    for (let btn of buttons) {
        btn.classList.remove('border-btnPrimary', 'bg-bgButton', 'rounded-full');
    }
    // active selected button
    const activeBtn = document.getElementById(`btn-${name}`);
    activeBtn.classList.remove('bg-white', 'border-neutral-300');
    activeBtn.classList.add('border-btnPrimary', 'bg-bgButton', 'rounded-full');

    showLoading();
    displayPets(typeData.data);

    // stored data for category based sorting
    if (name) {
        petsData = typeData.data;
    }
};

const loadPetDetails = async (petId) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
    const data = await response.json();

    displayPetDetails(data.petData);
};

const displayCategories = (categories) => {
    const btnPets = document.getElementById("pet-button");

    categories.forEach(item => {
        // create a button 
        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = `
        <button id="btn-${item.category.toLowerCase()}" onclick="loadPetsByName('${item.category.toLowerCase()}')" class="category-btn btn w-40 bg-white text-lg font-bold gap-3 border-neutral-300">
            <img class="w-8 h-8" src=${item.category_icon}" alt="" />${item.category}
        </button> 
        `;

        btnPets.append(buttonContainer);

    });
};

const displayPets = (pets) => {
    const fetchPets = document.getElementById("pets-card");
    fetchPets.innerHTML = "";

    if (pets.length === 0) {
        fetchPets.classList.remove("grid");
        fetchPets.innerHTML = `
        <div class="min-h-[450px] bg-base-200 rounded-xl  flex flex-col gap-5 justify-center items-center">
            <img src="./images/error.webp" alt="">
            <h2 class="text-xl md:text-3xl font-extrabold text-center">No Information Available</h2>
            <p class="text-sm md:text-lg text-center md:w-[80%] lg:w-[70%]">
                We currently have no pets listed under this category. Please check back later
                or explore other categories to find your perfect companion
            </p>
        </div>
        `;
        return;
    } else {
        fetchPets.classList.add("grid");
    }

    pets.forEach(item => {
        const card = document.createElement("div");
        card.classList = "p-4 space-y-4 border rounded-xl";

        card.innerHTML = `
        <div class="border rounded-xl overflow-hidden">
            <img class="w-full h-full object-cover" src="${item.image}" alt="" />
        </div>
        <div class="flex flex-col space-y-1">
            <h3 class="text-2xl font-extrabold">${item.pet_name ? item.pet_name : "Unknown"}</h3>
            <p class="opacity-80 text-lg">
                <i class="fa-solid fa-table-cells-large"></i> Breed: ${item.breed ? item.breed : "Unknown"}
            </p>
            <p class="opacity-80 text-lg">
                <i class="fa-regular fa-calendar"></i> Birth: ${item.date_of_birth ? item.date_of_birth.slice(0, 4) : "Not Given"}
            </p>
            <p class="opacity-80 text-lg">
                <i class="fa-solid fa-mercury"></i> Gender: ${item.gender ? item.gender : "Not Given"}
            </p>
            <p class="opacity-80 text-lg">
                <i class="fa-solid fa-dollar-sign"></i> Price: ${item.price ? item.price : "Not Given"}
            </p>
        </div>
        <hr>
        <div class="flex flex-wrap gap-2">
            <button onclick="likedPet('${item.image}')" class="flex-1 btn text-btnPrimary text-lg bg-white border-neutral-300"><i class="fa-regular fa-thumbs-up"></i></button>
            <button id="myButton-${item.petId}" onclick="displayAdoptMessage(${item.petId})" class="flex-1 btn text-btnPrimary text-lg bg-white border-neutral-300">Adopt</button>
            <button onclick="loadPetDetails(${item.petId})" class="flex-1 btn text-btnPrimary text-lg bg-white border-neutral-300">Details</button>
        </div>
        `;

        fetchPets.append(card);
    });
};

const displayPetDetails = (pet) => {
    const detailContainer = document.getElementById("modal-action");

    detailContainer.innerHTML = `
    <!-- Image Section -->
    <div class="w-full h-80">
        <img src="${pet.image}" alt="Pet Image" class="w-full h-full object-cover rounded-xl">
    </div>
    <!-- Text Section -->
    <div class="p-4">
        <!-- Title Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5 items-center">
        <div>
            <h3 class="text-2xl font-bold">${pet.pet_name ? pet.pet_name : "Unknown"}</h3>
            <p class="text-sm opacity-70">Breed: ${pet.breed ? pet.breed : "Unknown"}</p>
            <p class="text-sm opacity-70">Gender: ${pet.gender ? pet.gender : "Not Given"}</p>
            <p class="text-sm opacity-70">Vaccinated status: ${pet.vaccinated_status ? pet.vaccinated_status : "Unknown"}</p>
        </div>
        <div>
            <p class="text-sm opacity-70">Birth: ${pet.date_of_birth ? pet.date_of_birth.slice(0, 4) : "Not Given"}</p>
            <p class="text-sm opacity-70">Price: ${pet.price ? pet.price : "Not Given"}</p>
        </div>
        </div>

        <!-- Details Information -->
        <div class="mt-4">
        <h4 class="text-lg font-bold">Details Information</h4>
        <p class="text-sm text-gray-600">
            ${pet.pet_details ? pet.pet_details : "Not Given"}
        </p>
        </div>
    </div>
    `;

    document.getElementById("details_modal").showModal();

};

const displayAdoptMessage = (petId) => {
    const modal = document.getElementById('adopt_modal');
    const countdownElement = document.getElementById('countdown').querySelector('div');
    let countdown = 3;

    modal.showModal();

    // starting countdown value
    countdownElement.textContent = `${countdown}`;

    // Start countdown
    const timer = setInterval(() => {
        countdown--;

        if (countdown > 0) {
            countdownElement.textContent = `${countdown}`;
        } else {
            clearInterval(timer);
            modal.close();

            const button = document.getElementById(`myButton-${petId}`);
            button.innerText = "Adopted";
            button.disabled = true; // Disable the button
        }
    }, 1000);

};

const likedPet = (image) => {
    const viewImageContainer = document.getElementById("view-image");

    const petImage = document.createElement("div");
    petImage.classList.add("w-full", "h-full");
    petImage.innerHTML = `
    <img class="object-cover w-full h-full rounded-lg" src="${image}" alt="" />
    `;

    viewImageContainer.append(petImage);
};

const sortPetsByPriceDesc = (pets) => {
    return pets.sort((a, b) => b.price - a.price);
};

const sortPets = () => {
    const sortedPets = sortPetsByPriceDesc(petsData);
    displayPets(sortedPets);
};


loadCategories();
loadPets();