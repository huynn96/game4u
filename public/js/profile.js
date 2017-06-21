var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dkxsfof3m/upload';
var CLOUDINARY_UPLOAD_PRESET = 'pql0iipe';

var imgPreview = document.getElementById('img-preview');
var fileUpload = document.getElementById('file-upload');

fileUpload.addEventListener('change', function (e) {
	var file = e.target.files[0];
	var formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

	axios({
		url: CLOUDINARY_URL,
		method: 'POST',
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: formData
	}).then(function (res) {
		imgPreview.src = res.data.secure_url;
		$("[name='photo']").val(imgPreview.src);
	}).catch(function (err) {
		console.log(err);
	})
})

$('#changebtn').click(function (e) {
	e.preventDefault();
	$('.change-password').toggle();
})