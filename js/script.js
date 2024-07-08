const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('card-container');
const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-but');

let selectedCategory = 1000;
let shortByView = false;

sortBtn.addEventListener('click', () => {
    shortByView = true;
    fetchDataCategories(selectedCategory, shortByView);
});

const fetchCategories = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const { data } = await res.json();
    data.forEach((card) => {
        const newBtn = document.createElement('button');
        newBtn.className = 'category-btn btn-ghost bg-slate-700 text-white text-lg px-10 py-2 rounded-lg';
        newBtn.textContent = card.category;
        newBtn.addEventListener('click', () => {
            fetchDataCategories(card.category_id);
            const allBtns = document.querySelectorAll('.category-btn');
            for (const btns of allBtns) {
                btns.classList.remove('bg-red-600');
            } newBtn.classList.add('bg-red-600');
        });
        btnContainer.appendChild(newBtn);
    });
};


const fetchDataCategories = async (id, shortByView) => {
    selectedCategory = id;
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
    const { data } = await res.json();

    if (shortByView) {
        data.sort((a, b) => {
            const totalViewsStarFirst = a.others?.views;
            const totalViewsStarSecond = b.others?.views;
            const totalViewsStarFirstNumber = parseFloat(totalViewsStarFirst.replace("k", '')) || 0;
            const totalViewsStarSecondNumber = parseFloat(totalViewsStarSecond.replace("k", '')) || 0;
            return totalViewsStarSecondNumber - totalViewsStarFirstNumber;
        });
    }

    if (data.length === 0) {
        errorElement.classList.remove('hidden');
    } else {
        errorElement.classList.add('hidden');
    }
    cardContainer.innerHTML = '';
    data.forEach((videos) => {
        // console.log(videos.others.posted_date)
        let verified = '';
        if (videos.authors[0].verified) {
            verified = `<img src="./images/star.png" alt="">`;
        }
        
        const newCard = document.createElement('div');
        newCard.innerHTML = `
        <div class="card card-compact w-full bg-base-100 shadow-xl">
        <figure class="overflow-hidden h-72">
            <img class="w-full" src="${videos.thumbnail}"
                alt="Shoes" />
            <h6 class="absolute bottom-[40%] right-12 bg-black text-white p-1">${videos.others.posted_date} hr</h6>
        </figure>
        <div class="card-body">
            <div class="flex space-x-6 justify-start items-start">
                <div><img class="w-12 h-12 rounded-full" src="${videos.authors[0].profile_picture}" alt=""></div>
                <div>
                    <h2 class="card-title">${videos.title}</h2>
                    <div class="flex space-x-4">
                        <h6>${videos.authors[0].profile_name}</h6>
                        ${verified}
                    </div>
                    <p class="mt-3">${videos.others.views}</p>
                </div>
            </div>

        </div>
    </div>
        `;
        cardContainer.appendChild(newCard);
    });
    // const 
};
fetchCategories();
fetchDataCategories(selectedCategory, shortByView);