import "../styles/index.scss"

let inputValue;
let imagesFetched = false;
let imagesData;
let imageLoopIndex = 0;
const API_KEY = '4h4OJouBndtiPtpClWP6Bp8GAzCeHeyS';

// Body related events
const body = document.querySelector('body')
body.addEventListener('keyup', (event) => {
    let key = event.key;
    if(key === 'Escape'){
        console.log(key)
        restartPage()
    }
})

// Input related events
const inputEl = document.querySelector('.middle__search-input')
inputEl.addEventListener('keyup', (event) => {
    let key = event.key
    inputValue = event.target.value
    const hint = document.querySelector('.bottom__hint')

    if(inputValue.length > 2){
        toggleHint(true) 
        if(key === 'Enter'){
            if(!imagesFetched){
                imagesData = fetchImages(inputValue);
                imagesData.then(data => {
                    onSearchLoad(false)
                    setVideo(data, imageLoopIndex)
                })
                imagesFetched = true;
            } else {
                console.log("Images has already been fetched")
                imageLoopIndex++;
                console.log(imageLoopIndex)
                imagesData.then(data => {
                    onSearchLoad(false)
                    setVideo(data, imageLoopIndex)
                })
            }
        }
    }
})

// Restart page 
const restartPage = () => {
    const videoEls = document.querySelector(".middle__videos")
    const hint = document.querySelector('.bottom__hint')

    videoEls.innerHTML = '';
    inputEl.value = '';
    inputEl.focus();
    imagesFetched = false;

    body.classList.remove('searched')
    toggleHint(false);
}

// Fetch images
const fetchImages = (value) => {
    onSearchLoad(true);
    return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${value}&limit=50&offset=0&rating=pg-13&lang=en`)
        .then(response => {
            return response.json();
        })
}

// Toggle class when searching
const onSearchLoad = (bool) => {
    if(bool){
        body.classList.add('searching')
    } else {
        body.classList.remove('searching')
        body.classList.add('searched')
    }
}

// Set video
const setVideo = (data, index) => {
    // console.log(index)
    const dataArray = data.data;
    if(index < dataArray.length){
        const videoSrc = data.data[index].images.original.mp4
        const video = createVideoElement(videoSrc);
        appendVideoElement(video);
    }
}

// Create video element
const createVideoElement = (videoSrc) => {
    const video = document.createElement('video')
    video.src = videoSrc;
    video.autoplay = true;
    video.loop = true;

    return video
}

// Toggle the hint text
const toggleHint = (bool) => {
    const hint = document.querySelector('.bottom__hint')
    const spanValue = document.createElement('span').innerHTML = inputValue;
    hint.innerHTML = `Hint enter to search ${spanValue}`
    if(bool){
        hint.classList.add('showHint')
    } else {
        hint.classList.remove('showHint')
    }
}

// Append the video element
const appendVideoElement = (video) => {
    const videoElement = document.querySelector('.middle__videos')
    video.addEventListener('loadeddata', () => {
        video.classList.add('animateIn')
    })
    videoElement.appendChild(video)
}


// Close icon
const closeIcon = document.querySelector('.top__close-icon')
closeIcon.addEventListener('click', () => {
    onSearchLoad(false)
    restartPage();
})