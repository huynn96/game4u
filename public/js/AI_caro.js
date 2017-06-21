$('.playpc').click(() => {
    $('#start').hide();
    $('.res').hide();
    $('.name2').text('PC');
    $('.photo2').show();
    $('#ready2').hide();
    $('.photo2').attr('src', 'http://genk2.vcmedia.vn/N0WoyYblO3QdmZFKPMtKnadHAHTevz/File/mo-dau_78a0f.jpg');
    $('.name1').addClass('chugreen');
    luot_choi = Math.floor(Math.random() * 2) + 1;
    for (var j = 0; j < MAX_H; j++) {
        for (var i = 0; i < MAX_C; i++) {
            bang[j][i] = 0;
        }
    }

    if ($('.ban_co').empty()) {
        for (var j = 0; j < MAX_H; j++) {
            for (var i = 0; i < MAX_C; i++) {
                bang[j][i] = 0;
                $(".ban_co").append("<img class='square' id='" + (i + j * MAX_C) + "' src='../img/Blank.jpg' width='30px'>");
            }
        }
    }
    var number = 0;
    if (luot_choi == 2){
    	number = computerMove(bang, number, true);
    }
    $(".square").click(function(e) {
        if (luot_choi == 1) {
            $("#" + number).removeClass('bordergreen');
            number = $(e.target).attr('id');
            hang = parseInt(number / MAX_C);
            cot = number % MAX_C;
            $(e.target).replaceWith("<img id='" + number + "' name='x' src='../img/X.jpg' width='30px'>");
            bang[hang][cot] = luot_choi;
            if (check_doc(bang, hang, cot, luot_choi) || check_ngang(bang, hang, cot, luot_choi) || check_cheo1(bang, hang, cot, luot_choi) || check_cheo2(bang, hang, cot, luot_choi)) {
                $(".res").replaceWith("<div class='res'><h1>" + username + " thắng</h1></div>");
                $("#start").show();
            }else{
	            luot_choi = 2;
	            number = computerMove(bang, number, false);
            }
        }
    });
})

function computerMove(bang, number, start) {
	bang2 = JSON.parse(JSON.stringify(bang));
	if (!start)
  		number = hueristic(bang2);
  	else number = 211;
    console.log(number);
    hang = parseInt(number / MAX_C);
    cot = number % MAX_C;
    $('#' + number).replaceWith("<img id='" + number + "' name='o' src='../img/O.jpg' width='30px'>");
    $('#' + number).addClass('bordergreen');
    bang[hang][cot] = luot_choi;
    if (check_doc(bang, hang, cot, luot_choi) || check_ngang(bang, hang, cot, luot_choi) || check_cheo1(bang, hang, cot, luot_choi) || check_cheo2(bang, hang, cot, luot_choi)) {
        $(".res").replaceWith("<div class='res'><h1>PC thắng</h1></div>");
        $("#start").show();
        luot_choi = 2;
    }else
    	luot_choi = 1;
    return number;
}
