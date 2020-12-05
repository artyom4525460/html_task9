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
    chatEmptyBlock : document.getElementById('chatEmptyBlock'),

    chatControls : document.getElementById('chatControls'),
    audioControls : document.getElementById('audioControls'),

    shadowBlock : document.getElementById('shadowBlock'),
    bottomPanel : document.getElementById('bottomPanel'),
    cameraButton : document.getElementById('cameraButton'),
    audioButton : document.getElementById('audioButton'),
    galleryButton : document.getElementById('galleryButton'),

    hideBottomPanel : () => {
        chat.bottomPanel.classList.add('hide')
        chat.shadowBlock.classList.add('hide')
        chat.attacheInputLink.classList.remove('active')
    },
    showBottomPanel : () => {
        chat.bottomPanel.classList.remove('hide')
        chat.shadowBlock.classList.remove('hide')
        chat.attacheInputLink.classList.add('active')
    },
    hideAudioInput : () => {
        chat.audioControls.classList.add('hide')
        chat.chatControls.classList.remove('hide')
    },
    showAudioInput : () => {
        chat.chatControls.classList.add('hide')
        chat.audioControls.classList.remove('hide')
        chat.hideBottomPanel()
    },

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
        chat.hideBottomPanel()
        if (!FileReader){
            alert("Your browser doesn't suppport FileReader")
        }
        if (FileReader && files && files.length) {
            let type = files[0].type.split('/')[0]
            chat.addSource(type, files[0])
            attacheInput.value = null;
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

    addSource : (type, data, fromStream = false) => {
        switch (type) {
            case 'video':
                chat.addVideo(data)
                break;

            case 'audio':
                chat.addAudio(data, fromStream)
                break;
            
            case 'image':
                chat.addImage(data)
                break;

            default:
                alert('Please attache video, audio or image')
                break;
        }
        if(!chat.chatEmptyBlock.classList.contains('hide')){
            chat.hideChatEmptyBlock()
        }
        if(chat.chatPublishRequestButton.classList.contains('disable')){
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

    addAudio : (data, fromStream) => {
        let audioId = 'audio-' + Math.floor(Math.random() * 1000)
        let item = document.getElementById('item-' + audioId)
        if(fromStream){
            new Promise( (resolve, reject) => {
                chat.chatScreen.innerHTML += chat.audioFileHtml(data, audioId)
                resolve('ok')
            }).then(()=> {
                chatDeleteEventsUpdate()
            }) 
        }
        else{
            let fr = new FileReader();
            fr.readAsDataURL(data);
            fr.onload = function () {
                new Promise( (resolve, reject) => {
                    chat.chatScreen.innerHTML += chat.audioFileHtml(fr.result, audioId)
                    resolve('ok')
                }).then(()=> {
                    chatDeleteEventsUpdate()
                }) 
            }
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

chat.attacheInputLink.addEventListener('click', function(e){
    e.preventDefault()
    chat.showBottomPanel()
})

chat.galleryButton.addEventListener('click', function(e){
    chat.attacheInput.click()
})

chat.attacheInput.addEventListener("change", chat.handleFiles, false)

chat.shadowBlock.addEventListener('click', chat.hideBottomPanel)

chat.audioButton.addEventListener('click', function(e){
    chat.showAudioInput()
    audio.recordAudio()
})

chat.sendButton.addEventListener("click", function(){
    if(chat.messageInput.value){
        chat.hideChatEmptyBlock()
        chat.enablePublishRequest()
        chat.addText(chat.messageInput.value)
        chat.messageInput.value = null
    }
})

var audioInterval

const audio = {
    chunks : [],
    constraints : { audio: true },
    sendButton : document.getElementById('sendAudioButton'),
    audioRecordInput : document.getElementById('audioRecordInput'),
    closeAudioButton : document.getElementById('closeAudioButton'),
    audioRecordTime : document.getElementById('audioRecordTime'),

    recordAudio : () => {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(audio.constraints).then(audio.onSuccess, audio.onError)
        }
        else{
            alert("You browser doesn't support getUserMedia")
        }
    },
    startCountTime(){
        let minutes = 0, seconds = 0, time = 0
        audioInterval = setInterval(function() {
            time++
            minutes = Math.floor(time / 60)
            seconds = time % 60
            audioRecordTime.innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
        }, 1000);
    },
    stopCountTime(){
        clearInterval(audioInterval)
        audioRecordTime.innerHTML = '00:00'
    },
    onSuccess : (stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()
        audio.startCountTime()
        let cancelAudio = false

        audio.sendButton.onclick = function() {
          mediaRecorder.stop()
          audio.stopCountTime()
        }

        audio.closeAudioButton.onclick = function() {
            cancelAudio = true
            mediaRecorder.stop()
            audio.stopCountTime()
        }
    
        mediaRecorder.onstop = function(e) {
            const blob = new Blob(audio.chunks, { 'type' : 'audio/ogg; codecs=opus' })
            audio.chunks = []
            if(!cancelAudio){
                const audioURL = window.URL.createObjectURL(blob)
                chat.addSource('audio', audioURL, true)
            }
            else{
                cancelAudio = false
            }
            chat.hideAudioInput()
        }
    
        mediaRecorder.ondataavailable = function(e) {
          audio.chunks.push(e.data)
        }
    },
    onError : (err) => {
        console.log('The following error occured: ' + err)
        chat.hideAudioInput()
    },
}