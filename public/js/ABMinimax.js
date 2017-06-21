const INF = 100000000000;
function hueristic(bang) {
	var hang = -1, cot = -1, mark = -1;
	// tempMark = calMark(bang, 0, 0, 2);
    for (var i = 0; i < MAX_H; i++) {
        for (var j = 0; j < MAX_C; j++) {
            if (bang[i][j] == 0){
            	tempMark = calMark(bang, i, j, 2);
            	// console.log(tempMark + " " + i + " " + j);
            	if (mark < tempMark){
            		hang = i;
            		cot = j;
            		mark = tempMark;
            	}
            }
        }
    }

    if (hang == -1 && cot == -1){
    	for (var i = 0; i < MAX_H; i++) {
        	for (var j = 0; j < MAX_C; j++) {
        		if (bang[i][j] == 0){
        			hang = i;
        			cot = j;
        		}
        	}
        }
    }
    return hang * MAX_C + cot;
}

function isWin(bang, hang, cot, luot_choi) {
	return check_doc(bang, hang, cot, luot_choi) || check_ngang(bang, hang, cot, luot_choi) || check_cheo1(bang, hang, cot, luot_choi) || check_cheo2(bang, hang, cot, luot_choi);
}

function generate(bang, luot_choi) {
	var result = [];
	for (var i = 0; i < MAX_H; i++) {
        for (var j = 0; j < MAX_C; j++) {
            if (bang[i][j] == 0){
            	var temp = {};
            	tempMark = calMark(bang, i, j, luot_choi);
            	temp.mark = tempMark;
				temp.hang = i;
            	temp.cot = j;
            	temp.value = luot_choi;
            	result.push(temp);
            }
        }
    }
    result.sort((a, b) => {return b.mark - a.mark});
    result = result.slice(0,9);
    return result;
}

function stateGenerate(bang, cell) {
	var res = JSON.parse(JSON.stringify(bang));
	res[cell.hang][cell.cot] = cell.value;
	return res;
}

function alphaBeta(bang){
	var max = -1, res;
	// console.log(generate(bang, 2));
	generate(bang, 2).forEach((cell, index) => {
		if (max < maxValue(stateGenerate(bang, cell), 0, cell))
			res = cell;
		console.log(max);
	})
	return res.hang * MAX_C + res.cot;
}

function maxValue(bang, depth, cell){
	if (isWin(bang, cell.hang, cell.cot, 1))
		return -INF;
	if (depth == 2)
		return 0;
	max = -1;
	generate(bang, 2).forEach((cell, index) => {
		max = Math.max(max, minValue(stateGenerate(bang, cell), depth + 1, cell));
	});
	return max;
}

function minValue(bang, depth, cell) {
	if (isWin(bang, cell.hang, cell.cot, 2))
		return INF;
	if (depth == 2)
		return calMark(bang, cell.hang, cell.cot, 2);
	min = INF;
	generate(bang, 1).forEach((cell, index) => {
		min = Math.min(min, maxValue(stateGenerate(bang, cell) , depth + 1, cell));
	});
	return min;
}