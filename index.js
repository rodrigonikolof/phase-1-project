    // fetch('https://api.thecatapi.com/v1/images/search')    cat API
	// .then(response => response.json())
	// .then(response => console.log(response))

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

// fetch('http://localhost:3000/bookmarked')
// .then(res => res.json())
// .then(data => console.log(data))