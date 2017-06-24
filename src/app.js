var openStream = require('./openStream');
var SimplePeer = require('simple-peer');
var playVideo = require('./playVideo');
// var $ = require('jquery');
var called = false;
var localStream;

socket.on('hasDisconnect', (data) => {
	$('.user1').html('');
	$('.user2').html('');
	$('.user1').append("<img src='' class='photo photo1'><button class='btn btn-default ready' id='ready1'>Ready</button><button class='btn btn-default video disabled' id='videoCall1'>Call</button><p class='name name1'></p>");
	$('.user2').append("<img src='' class='photo photo2'><button class='btn btn-default ready' id='ready2'>Ready</button><button class='btn btn-default video disabled' id='videoCall2'>Call</button><p class='name name2'></p>");
	localStream.getTracks()[0].stop();
})

socket.on('calling', (data) => {
    if (!called) {
    	var audio = new Audio('/sound/Facetime Sound-Ringing.mp3');
		audio.play();
        $('#myModal').modal({ backdrop: 'static', show: 'true' });
        $('#answerCalling').click(() => {
        	audio.pause();
        	$('#myModal').modal('hide');
            if (username == $('.name1').html()) {
                $('.user1').append("<video id='localVideo' autoplay='autoplay'></video>");
                $('.user2').append("<video id='remoteVideo' autoplay='autoplay'></video>");
            } else {
                $('.user1').append("<video id='remoteVideo' autoplay='autoplay'></video>");
                $('.user2').append("<video id='localVideo' autoplay='autoplay'></video>");
            }

            openStream((stream) => {
            	localStream = stream;
                var peer = new SimplePeer({ initiator: location.hash === '#1', trickle: false, stream: stream });
                playVideo(stream, 'localVideo');

                peer.on('signal', function(token) {
                    socket.emit('answerCall', { token: token});
                })

                peer.signal(data.token);

                peer.on('connect', () => console.log('connected'));

                // peer2.on('signal', function(data) {
                //     peer1.signal(data);
                // })

                peer.on('stream', function(stream) {
                    playVideo(stream, 'remoteVideo');
                })
            });
        })
    }
})

$('.video').click((e) => {
    if (username == $('.name1').html()) {
        $('.user1').append("<video id='localVideo' autoplay='autoplay'></video>");
        $('.user2').append("<video id='remoteVideo' autoplay='autoplay'></video>");
    } else {
        $('.user1').append("<video id='remoteVideo' autoplay='autoplay'></video>");
        $('.user2').append("<video id='localVideo' autoplay='autoplay'></video>");
    }

    openStream((stream) => {
        var peer = new SimplePeer({ initiator: true, trickle: false, stream: stream });
        playVideo(stream, 'localVideo');

        peer.on('signal', function(token) {
            called = true;
            socket.emit('callVideo', { token: token });
        })

        socket.on('answerCall', (data) => {
        	peer.signal(data.token);
        })

        // peer2.on('signal', function(data) {
        //     peer1.signal(data);
        // })

        peer.on('stream', function(stream) {
            playVideo(stream, 'remoteVideo');
        })
    });
})
