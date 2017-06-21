var MARK_DEFEND = [0, 3, 27, 99, 729, 6561, 59049];
var MARK_ATTACK = [0, 9, 54, 162, 1458, 13112, 118008];

function calMark(bang, hang, cot, luot_choi) {
	var attack = mark_ngang_attack(bang, hang, cot, luot_choi) + mark_doc_attack(bang, hang, cot, luot_choi) + mark_cheo1_attack(bang, hang, cot, luot_choi) + mark_cheo2_attack(bang, hang, cot, luot_choi);
	var defend = mark_ngang_defend(bang, hang, cot, luot_choi) + mark_doc_defend(bang, hang, cot, luot_choi)  + mark_cheo1_defend(bang, hang, cot, luot_choi) + mark_cheo2_defend(bang, hang, cot, luot_choi);
	var res = attack > defend ? attack : defend;
	// console.log(res + " " + hang + " " + cot + " " + attack + " " + defend);
	return res;
}

function mark_ngang_attack(bang, hang, cot, luot_choi){
    i = 1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((cot + i < MAX_C) && (i < 6)){
        if (bang[hang][cot + i] == luot_choi)
        	quanTa++;
        else
        if (bang[hang][cot + i] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        i++;
    }
    j = 1;
    while ((cot - j > -1) && (j < 6)) {
       	if (bang[hang][cot - j] == luot_choi)
        	quanTa++;
        else
        if (bang[hang][cot - j] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        j++;
    }
    if (quanDich == 2)
    	return 0;
    // console.log(quanDich + " " + quanTa);
    mark -= MARK_DEFEND[quanDich + 1] * 2;
    mark += MARK_ATTACK[quanTa];
    return mark;
}

function mark_doc_attack(bang, hang, cot, luot_choi) {
    i = 1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((hang + i < MAX_H) && (i < 6)){
        if (bang[hang + i][cot] == luot_choi)
        	quanTa++;
        else
        if (bang[hang + i][cot] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        i++;
    }
    j = -1;
    while ((hang + j > -1) && (j > -6)) {
       	if (bang[hang + j][cot] == luot_choi)
        	quanTa++;
        else
        if (bang[hang + j][cot] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        j--;
    }
    if (quanDich == 2)
    	return 0;
    mark -= MARK_DEFEND[quanDich + 1];
    mark += MARK_ATTACK[quanTa];
    return mark;
}

function mark_cheo1_attack(bang, hang, cot, luot_choi) {
    i = 1;
    j = 1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((hang + i < MAX_H) && (cot + j < MAX_C)  && (i < 6)){
        if (bang[hang + i][cot + j] == luot_choi)
        	quanTa++;
        else
        if (bang[hang + i][cot + j] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        i++;
        j++;
    }
    i = -1;
    j = -1;
    while ((hang + i > -1) && (cot + j > -1) && (j > -6)) {
       	if (bang[hang + i][cot + j] == luot_choi)
        	quanTa++;
        else
        if (bang[hang + i][cot + j] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        i--;
        j--;
    }
    if (quanDich == 2)
    	return 0;
    mark -= MARK_DEFEND[quanDich + 1];
    mark += MARK_ATTACK[quanTa];
    return mark;
}

function mark_cheo2_attack(bang, hang, cot, luot_choi) {
    i = 1;
    j = -1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((hang + i < MAX_H) && (cot + j > -1)  && (i < 6)){
        if (bang[hang + i][cot + j] == luot_choi)
        	quanTa++;
        else
        if (bang[hang + i][cot + j] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        i++;
        j--;
    }
    i = -1;
    j = 1;
    while ((hang + i > -1) && (cot + j < MAX_C) && (j > -6)) {
       	if (bang[hang + i][cot + j] == luot_choi)
        	quanTa++;
        else
        if (bang[hang + i][cot + j] == (3-luot_choi)){
        	quanDich++;
        	break;
        }
        else 
        	break;
        i--;
        j++;
    }
    if (quanDich == 2)
    	return 0;
    mark -= MARK_DEFEND[quanDich + 1];
    mark += MARK_ATTACK[quanTa];
    return mark;
}

function mark_ngang_defend(bang, hang, cot, luot_choi){
    i = 1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((cot + i < MAX_C) && (i < 6)){
        if (bang[hang][cot + i] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang][cot + i] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        i++;
    }
    j = -1;
    while ((cot + j > -1) && (j > -6)) {
       	if (bang[hang][cot + j] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang][cot + j] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        j--;
    }
    if (quanTa == 2)
    	return 0;
    mark += MARK_DEFEND[quanDich];
    return mark;
}

function mark_doc_defend(bang, hang, cot, luot_choi) {
    i = 1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((hang + i < MAX_H) && (i < 6)){
        if (bang[hang + i][cot] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang + i][cot] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        i++;
    }
    j = -1;
    while ((hang + j > -1) && (j > -6)) {
       	if (bang[hang + j][cot] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang + j][cot] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        j--;
    }
    if (quanTa == 2)
    	return 0;
    mark += MARK_DEFEND[quanDich];
    return mark;
}

function mark_cheo1_defend(bang, hang, cot, luot_choi) {
    i = 1;
    j = 1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((hang + i < MAX_H) && (cot + j < MAX_C)  && (i < 6)){
        if (bang[hang + i][cot + j] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang + i][cot + j] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        i++;
        j++;
    }
    i = -1;
    j = -1;
    while ((hang + i > -1) && (cot + j > -1) && (j > -6)) {
       	if (bang[hang + i][cot + j] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang + i][cot + j] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        i--;
        j--;
    }
    if (quanTa == 2)
    	return 0;
    mark += MARK_DEFEND[quanDich];
    return mark;
}

function mark_cheo2_defend(bang, hang, cot, luot_choi) {
    i = 1;
    j = -1;
    var quanTa = 0, quanDich = 0, mark = 0;
    while ((hang + i < MAX_H) && (cot + j > -1)  && (i < 6)){
        if (bang[hang + i][cot + j] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang + i][cot + j] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        i++;
        j--;
    }
    i = -1;
    j = 1;
    while ((hang + i > -1) && (cot + j < MAX_C) && (j > -6)) {
       	if (bang[hang + i][cot + j] == (3-luot_choi))
        	quanDich++;
        else
        if (bang[hang + i][cot + j] == luot_choi){
        	quanTa++;
        	break;
        }
        else 
        	break;
        i--;
        j++;
    }
    if (quanTa == 2)
    	return 0;
    mark += MARK_DEFEND[quanDich];
    return mark;
}