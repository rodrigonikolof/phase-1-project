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
    <button class="button-22 mobile" id='bookmarkBtn'>Add to Bookmarks</button>
    <button class="button-22 mobile" id='nextCat'>Next Cat</button>`
    document.querySelector('#nextCat').addEventListener('click', getCats)
    imageUrl = data;
    document.querySelector('#bookmarkBtn').addEventListener('click', ()  => createCatObj(imageUrl))
}

function renderDogPicture(data){
    clearMain();
    main.innerHTML = `<img class='mainPic'src='${data}'>
    <button class="button-22 mobile" id='bookmarkBtn'>Add to Bookmarks</button>
    <button class="button-22 mobile" id='nextDog'>Next Dog</button>`
    document.querySelector('#nextDog').addEventListener('click', getDogs)
    imageUrl = data;
    document.querySelector('#bookmarkBtn').addEventListener('click', ()  => createDogObj(imageUrl))
}

//changes text on Add to Bookmark button and disables it
function handleAddToBookmarks(){
    let btn = document.querySelector('#bookmarkBtn')
    if (btn.innerText == 'Add to Bookmarks'){
        btn.innerText = 'Saved in Bookmarks';
        btn.setAttribute('disabled', 'disabled')
        btn.style.backgroundColor = 'grey';
       
    }
}

//creates objects from fetched data
function createCatObj(data){
    let obj = {
        "url" : data,
        "type": 'cat', 
    }
    saveAnimal(obj)
    handleAddToBookmarks()
}
function createDogObj(data){
    let obj = {
        "url" : data,
        "type": 'dog', 
    }
    saveAnimal(obj)
    handleAddToBookmarks()
}

//sends saved object to database
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
    <h2> My Bookmarks </h2>  
    <div class="filterDiv">  
    <label id="filters">Filter:</label>
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

//listens for change in select tag and grabs value
function buildFilter(){
    const filter = document.querySelector('#filter-bookmarks');
    filter.addEventListener('change', ()=>{
        let filterValue = filter.value;
        filterBookmarks(filterValue);
    })
}

//renders bookmarks as per filtered value
function filterBookmarks(filterValue){
    
    filteredBookmarked = bookmarked.filter(el => {
      
    if (el.type == filterValue){return el}
    else if(filterValue == 'both'){return el}
    
    })
    main.innerHTML = `
    <h2> My Bookmarks </h2> 
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


//Creates cards/divs for bookmarked elements
function renderBookmarks(el){
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `<img src="${el.url}" class="bookmarkPic">
    <button class="button-0" id="deleteBtn">Delete</button>`;
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


// DARK MODE// 
let checkbox = document.querySelector('#checkbox')
checkbox.addEventListener('click', ()=> {
    document.querySelector('body').classList.toggle('dark-mode');
   let h6 = document.querySelectorAll('h6');
   let h2=  document.querySelectorAll('h2');
   let ps = document.querySelectorAll('p');
   h6.forEach((el)=> el.classList.toggle('text-dark-mode'))
   h2.forEach((el)=> el.classList.toggle('text-dark-mode'))
   ps.forEach((el)=> el.classList.toggle('text-dark-mode'))
    let darkModeLabel = document.querySelector('#darkmode-label');
    darkModeLabel.innerText == 'Dark Mode OFF' ? darkModeLabel.innerText = 'Dark Mode ON' : darkModeLabel.innerText = 'Dark Mode OFF'

    
})

// RANDOM HOME PAGE //
function randomSpecies(){
   let random = Math.round(Math.random())
   random == 1? getCats():getDogs()
}
document.querySelector('#surpriseBtn').addEventListener('click', ()=> randomSpecies())
document.querySelector('#logo').addEventListener('click', ()=> window.location.reload())