let modal = {
    modalBlock : document.getElementById('modalBlock'),
    modalEditButton : document.getElementById('modalEditButton'),
    onShow : (event) => {
        modal.modalBlock.classList.remove('hide')
    },
    onHide : () => {
        modal.modalBlock.classList.add('hide')
    }
}

let chat = {
    chatBlock : document.getElementById('chatBlock'),
    chatPublishRequestButton : document.getElementById('chatPublishRequest'),
    attacheInputLink : document.getElementById('attacheInputLink'),
    attacheInput : document.getElementById('attacheInput'),
    chatScreen : document.getElementById('chatScreen'),
    sendButton : document.getElementById('sendButton'),
    messageInput : document.getElementById('messageInput'),
    chatEmptyBlock: document.getElementById('chatEmptyBlock'),
    hideChatEmptyBlock : () => {
        chat.chatEmptyBlock.classList.add('hide')
    },
    showChatEmptyBlock : () => {
        chat.chatEmptyBlock.classList.remove('hide')
    },
    onPublishRequestClick : () => {
        modal.onShow()
    },
    enablePublishRequest : () => {
        chat.chatPublishRequestButton.classList.remove('disable')
    },
    disablePublishRequest : () => {
        chat.chatPublishRequestButton.classList.add('disable')
    },
    handleFiles : () => {
        let files = chat.attacheInput.files
        if (!FileReader){
            alert("Your browser doesn't suppport FileReader") 
        }
        if (FileReader && files && files.length) {
            let type = files[0].type.split('/')[0]
            chat.addSource(type, files[0])
        }
        else {

        }
    },
    videoFileHtml : (src, id) => {
        return `
            <div class="item" id="item-${id}">
                <div class="close-button" id="close-${id}"><img src='./images/close.svg'/></div>
                <div class="attache video">
                    <video preload="metadata" id="${id}">
                        <source src="${src}" type="video/mp4">
                    </video>
                    <div class="video-button-block" id="button-block-${id}">
                        <div class="video-button" id="button-${id}">
                            <img src="./images/play.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    audioFileHtml : (src, id) => {
        return `
            <div class="item" id="item-${id}">
                <div class="close-button" id="close-${id}"><img src='./images/close.svg'/></div>
                <div class="audio">
                    <audio controls id="${id}">
                        <source src="${src}">
                    </audio>
                </div>
                <div class="time">${chat.getTime()}</div>
            </div>
        `
    },

    imageFileHtml : (src, id) => {
        return `
            <div class="item" id="item-${id}">
                <div class="close-button" id="close-${id}"><img src='./images/close.svg'/></div>
                <div class="image">
                    <img id="${id}" src="${src}" alt="">
                </div>
            </div>
        `
    },

    textHtml : (text, id) => {
        return `
            <div class="item" id="item-${id}">
                <div class="close-button" id="close-${id}"><img src='./images/close.svg'/></div>
                <div class="text">
                    ${text}
                </div>
                <div class="time">${chat.getTime()}</div>
            </div>
        `
    },

    addSource : (type, data) => {
        switch (type) {
            case 'video':
                chat.addVideo(data)
                break;

            case 'audio':
                chat.addAudio(data)
                break;
            
            case 'image':
                chat.addImage(data)
                break;

            default:
                alert('Please attache video, audio or image')
                break;
        }
        if(!chatEmptyBlock.classList.contains('hide')){
            chat.hideChatEmptyBlock()
        }
        if(!chat.chatPublishRequestButton.contains('disable')){
            chat.enablePublishRequest()
        }
    },

    getTime : () => {
        let date = new Date()
        let hours = date.getHours()
        let ampm = 'AM'
        let minutes = date.getMinutes()
        if(hours > 12){
            hours -= 12
            ampm = 'PM'
        }
        if(minutes < 10){
            minutes = '0' + minutes
        }
        return `${hours}:${minutes}${ampm}`
    },

    addImage : (data) => {
        let fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = function () {
            let imageId = 'image-' + Math.floor(Math.random() * 1000)
            new Promise( (resolve, reject) => {
                chat.chatScreen.innerHTML += chat.imageFileHtml(fr.result, imageId)
                resolve('ok')
            }).then(()=> {
                chatDeleteEventsUpdate()
            }) 
        }
    },

    addAudio : (data) => {
        let fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = function () {
            let audioId = 'audio-' + Math.floor(Math.random() * 1000)
            let item = document.getElementById('item-' + audioId)
            new Promise( (resolve, reject) => {
                //uploadingModal.onShow()
                chat.chatScreen.innerHTML += chat.audioFileHtml(fr.result, audioId)
                resolve('ok')
            }).then(()=> {
                let closeButton = document.getElementById('close-' + audioId)
                let item = document.getElementById('item-' + audioId)
                chatDeleteEventsUpdate()
            }) 
        }
    },

    addVideo : (data) => {
        let fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = function () {
            let videoId = 'video-' + Math.floor(Math.random() * 1000)
            new Promise( (resolve, reject) => {
                    //uploadingModal.onShow()
                    chat.chatScreen.innerHTML += chat.videoFileHtml(fr.result, videoId)
                    resolve('ok')
                }
            ).then(() => {
                let buttonId = 'button-' + videoId
                let button = document.getElementById(buttonId)
                let chatVideo = document.getElementById(videoId)
                let videoButton = document.getElementById('button-block-' + videoId)
                let item = document.getElementById('item-' + videoId)
                let closeButton = document.getElementById('close-' + videoId)
                button.addEventListener('click', function(){
                    videoButton.style.display = 'none'
                    chatVideo.play()
                    chatVideo.setAttribute('data-state', 'play')
                })
                chatVideo.addEventListener('click', function(){
                    videoButton.style.display = 'none'
                    switch (chatVideo.dataset.state) {
                        case 'play':
                            chatVideo.pause()
                            chatVideo.setAttribute('data-state', 'pause')
                            break;
                        case 'pause':
                            chatVideo.play()
                            chatVideo.setAttribute('data-state', 'play')
                            break;
                        default:
                            break;
                    }
                })
                chatDeleteEventsUpdate()
            })
        }
    },
    
    addText : (text) => {
        let messageId = 'message-' + Math.floor(Math.random() * 1000)
        let item, closeButton
        new Promise( (resolve, reject) => {
            chat.chatScreen.innerHTML += chat.textHtml(text, messageId)
            resolve('ok')
        }).then(() => {
            chatDeleteEventsUpdate()
        })
    }
}

var closeButtons

function chatDeleteEventsUpdate(){
    closeButtons = document.getElementsByClassName('close-button')
    for( let i = 0; i < closeButtons.length; i++){
        closeButtons[i].addEventListener('click', function(){
            this.parentElement.remove()
        }) 
    }
}

modal.modalEditButton.addEventListener('click', modal.onHide)
chat.chatPublishRequestButton.addEventListener('click', modal.onShow)

/**
 * 
 * Chat Events
 * 
 */

chat.attacheInputLink.addEventListener('click', function(e){
    e.preventDefault()
    chat.attacheInput.click()
})

chat.attacheInput.addEventListener("change", chat.handleFiles, false)

chat.sendButton.addEventListener("click", function(){
    if(chat.messageInput.value){
        chat.hideChatEmptyBlock()
        chat.enablePublishRequest()
        chat.addText(chat.messageInput.value)
        chat.messageInput.value = null
    }
})
