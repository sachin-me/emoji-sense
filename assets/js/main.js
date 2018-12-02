import '../css/style.scss';

let inputText = document.querySelector('.input-text');
let displayImg = document.querySelector('.display-img');
let form = document.querySelector('.form');
let navBar = document.querySelector('.navbar-list');
var url = "http://api.giphy.com/v1/gifs/search?";
var query = "";
var key = "&api_key=4lhG2kbqPHauRqDVhRjW280Rjaznd9J6";
var img;
var fileSelector = document.querySelector('.file-selector');
var userFiles = document.querySelector('.user-files');
let srcEl;
let thirdEl;
let allList = document.querySelector('.all-list');
let dnd = document.querySelector('.dnd');
let uploadForm = document.querySelector('.upload-form');

var imgArr = [];
let favArr = JSON.parse(localStorage.getItem("fav")) || [];

function displayEmoji(imgArray = []) {
  var xhr = fetch(`${url}${key}${query}`).then(data => data.json()).then(res => {
    userFiles.innerHTML = " ";
    for (let i = 0; i < 6; i++) {
      var htmlText = "";
      htmlText = `
        <span class="img draggable" draggable="true">
          <a data-id="${i}" target="_blank" href="${res.data[i].images.fixed_height_downsampled.url}"><img class="gif" data-id="${i}" src="${res.data[i].images.fixed_height_downsampled.url}"></a>
          <div class="fav-btn">
            <button data-id="${i}" class="fav">Add To Fav</button>
          </div>
        </span>
      `
      displayImg.innerHTML += htmlText;
      drag();
      imgArray.push(`${res.data[i].images.fixed_height_downsampled.url}`);
    }
  });
  inputText.value = "";
}

// Display Imoji

function displayInfo() {
  let text = inputText.value;
  if (inputText.value) {
    query = `&q=${text}`;
    displayEmoji(imgArr);
  }
  inputText.value = "";
}

// addFavorite

function dispFavorite(fav = []) {
  displayImg.innerHTML = " ";
  favArr.forEach((v,i) => {
    var favour = `
      <span class="img draggable" draggable="true">
        <a data-id="${i}" target="_blank" href="${v}"><img class="gif" data-id="${i}" src="${v}"></a>
        <button data-id="${i}" class="del">delete</button>
      </span>
      `;
    displayImg.innerHTML += favour;
    drag();
  });
}

// Trending

function trending() {
  displayImg.innerHTML = " ";
  query = `&q=${trending}`;
  displayEmoji(imgArr);
}

displayImg.addEventListener("click", function(e) {
  if (e.target.classList.contains('fav')) {
    var id = e.target.dataset.id;
    if (favArr.includes(imgArr[id])) return;
    favArr.push(imgArr[id]);
    localStorage.setItem('fav', JSON.stringify(favArr));
    JSON.parse(localStorage.getItem('fav'));
  }
  if (e.target.classList.contains('del')) {
    var id = e.target.dataset.id;
    console.log(id);
    favArr.splice(id,1);
    localStorage.setItem('fav', JSON.stringify(favArr));
    dispFavorite();
  }
})



navBar.addEventListener("click", function(e) {
  if (e.target.classList.contains('trending-list')) {
    trending();
  }
  if (e.target.classList.contains('favorite-list')) {
    dispFavorite(favArr);
  }
  if (e.target.classList.contains('all-list')) {
    form.style.display = "block";
    displayEmoji(imgArr);
  }
  if (e.target.classList.contains('upload-list')) {
    uploadForm.style.display = "block";
    dnd.style.display = "block";
  }
})

form.addEventListener("submit", (e) => {
  e.preventDefault();
  displayInfo();
});

// Uploading Files

uploadForm.addEventListener("submit", function(e) {
  e.preventDefault();
  let files = fileSelector.files;
  if(files.length) {
    for(const file of files) {
      displayImg.innerHTML = " ";
      userFiles.innerHTML += `
        <img src="${URL.createObjectURL(file)}" draggable="true" class="draggable" />
      `;
      drag();
    }
  }

})


// Drag and drop

function dragStart(e) {
  e.target.style.opacity = "0.5";
  srcEl = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
}
function dragEnter(e) {
  e.target.classList.add('over');
}
function dragLeave(e) {
  e.stopPropagation();
  e.target.classList.remove('over');
}
function dragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function dragDrop(e) {
  console.log('drag drop')
  if (srcEl != e.target) {
    thirdEl = srcEl.src;
    srcEl.src = e.target.src;
    e.target.src = thirdEl;
  }
  return false;
}
function dragEnd(e) {
  var col = document.querySelectorAll('.draggable');
  col.forEach(function(element) {
    element.classList.remove('over');
  });
  e.target.style.opacity = '1';
}

function drag() {
  let drag1 = document.querySelectorAll('.draggable');
  drag1.forEach(function(item) {
    addEvent(item);
  });
}

function addEvent(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}


