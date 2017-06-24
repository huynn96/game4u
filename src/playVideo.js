function playVideo(stream, idVideo) {
    var video = document.getElementById(idVideo);
    video.src = window.URL.createObjectURL(stream);
    video.play();
}

module.exports = playVideo;