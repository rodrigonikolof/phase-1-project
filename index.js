    // https://random.dog/woof.json   dog API

    // https://dog.ceo/dog-api/documentation/random another dog API

    // https://cataas.com/#/       cat API


function getCats(){
    fetch('https://api.thecatapi.com/v1/images/search')
    .then(response => response.json())
    .then (data => renderCatPicture(data[0].url)) 
}
function getDogs (){ 
    fetch('https://random.dog/woof.json')    
	.then(response => response.json())
	.then(data => renderDogPicture(data.url))
}

document.querySelector('#catBtn').addEventListener('click', getCats);
document.querySelector('#dogBtn').addEventListener('click', getDogs);
document.querySelector('#bookmarksDiv').addEventListener('click', fetchBookmarks );
const main = document.querySelector('.main');

let imageUrl;

function clearMain(){
    main.innerHTML = "";
}

function renderCatPicture(data){
    clearMain();
    main.innerHTML = `<img class='mainPic'src='${data}'>
    <button id='bookmarkBtn'>Save For Later</button>
    <button id='nextCat'>Show Me More Cats</button>`
    document.querySelector('#nextCat').addEventListener('click', getCats)
    imageUrl = data;
    document.querySelector('#bookmarkBtn').addEventListener('click', ()  => createCatObj(imageUrl))
}

function renderDogPicture(data){
    clearMain();
    main.innerHTML = `<img class='mainPic'src='${data}'>
    <button id='bookmarkBtn'>Save For Later</button>
    <button id='nextDog'>Show Me More Dogs</button>`
    document.querySelector('#nextDog').addEventListener('click', getDogs)
    imageUrl = data;
    document.querySelector('#bookmarkBtn').addEventListener('click', ()  => createDogObj(imageUrl))
}

function createCatObj(data){
    let obj = {
        "url" : data,
        "type": 'cat', 
    }
    saveAnimal(obj)
}
function createDogObj(data){
    let obj = {
        "url" : data,
        "type": 'dog', 
    }
    saveAnimal(obj)
}

function saveAnimal(obj){
    fetch('http://localhost:3000/bookmarked/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accepts' : 'application.json',
        },
        body: JSON.stringify(obj)
    })
}

let bookmarked = [];
let filteredBookmarked = [];

function fetchBookmarks(){
fetch('http://localhost:3000/bookmarked')
.then(res => res.json())
.then(data=> allBookmarks(data))
}

function allBookmarks(data){
    clearMain();
    main.innerHTML= `
    <div class="filterDiv">    
    <label>Filter:</label>
    <select id="filter-bookmarks" name="filter-bookmarks">
    <option value="" selected disabled hidden>Select</option>
    <option value="both">Cats and Dogs</option>
    <option value="dog">Dogs</option>
    <option value="cat">Cats</option>
    </select> 
    </div>`
    buildFilter();
    bookmarked = [];
    data.forEach(el => bookmarked.push(el))
    bookmarked.forEach(el=>renderBookmarks(el))
}
function buildFilter(){
    const filter = document.querySelector('#filter-bookmarks');
    filter.addEventListener('change', ()=>{
        let filterValue = filter.value;
        filterBookmarks(filterValue);
    })
}


function filterBookmarks(filterValue){
    
    filteredBookmarked = bookmarked.filter(el => {
      
    if (el.type == filterValue){return el}
    else if(filterValue == 'both'){return el}
    
    })
    main.innerHTML = `
    <div class="filterDiv">    
    <label>Filter:</label>
    <select id="filter-bookmarks" name="filter-bookmarks">
    <option value="" selected disabled hidden>Select</option>
    <option value="both">Cats and Dogs</option>
    <option value="dog">Dogs</option>
    <option value="cat">Cats</option>
    </select> 
    </div>`;
    buildFilter();
    filteredBookmarked.forEach(renderBookmarks)
}



function renderBookmarks(el){
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `<img src="${el.url}" class="bookmarkPic">
    <button id="deleteBtn">Delete</button>`;
    let id = el.id;
    main.appendChild(card)
    card.querySelector('#deleteBtn').addEventListener('click', () => {
    deleteBookmark(id);
    card.remove(); 
    })
}

function deleteBookmark(id){
    fetch(`http://localhost:3000/bookmarked/${id}`,{
        method: 'DELETE',
        headers: {'Content-Type' : 'application/json', 'Accepts': 'application/json'},
    })
}

