const inputs = document.querySelectorAll('.input');
const operators = document.querySelectorAll('.op');
const all = document.querySelector('.all');
const confirmButton = document.getElementById("confirm");
const clearButton = document.getElementById("clear");

let solutions = [];
let clickAll = 0;

const solverInit = () => {

	//confirmButton.addEventListener('click', () => check_math());

	clearButton.addEventListener('click', () => {
		const elements = document.querySelectorAll('input');
		for (let i = 0; i < elements.length; i++) elements[i].value = '';
	});

};

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function Generate() {
	t1 = performance.now();

	char_list = ["+","-","*"];
	for (let i = 0; i < operators.length; i++){
		operators[i].value = char_list[getRandomInt(0,2)];
	}

	hidden_numbers = [];
	for (let i = 0; i < 9; i++){
		hidden_numbers.push(getRandomInt(0,9));
	}

	let rows = [];

	for (let i = 0; i < 3; i++){
		rows.push(eval(hidden_numbers[3*i] + String(document.getElementById("O" + 5*i).value) + hidden_numbers[3*i + 1] + String(document.getElementById("O" + (5*i + 1)).value) + hidden_numbers[3*i + 2]))
		//console.log(hidden_numbers[3*i] + String(document.getElementById("O" + 5*i).value) + hidden_numbers[3*i + 1] + String(document.getElementById("O" + (5*i + 1)).value) + hidden_numbers[3*i + 2]);
	}

	//console.log("");

	let columns = [];

	for (let i = 0; i < 3; i++){
		columns.push(eval(hidden_numbers[i] + String(document.getElementById("O" + (i + 2)).value) + hidden_numbers[i + 3] + String(document.getElementById("O" + (i + 7)).value) + hidden_numbers[i + 6]))
		//console.log(hidden_numbers[i] + String(document.getElementById("O" + (i + 2)).value) + hidden_numbers[i + 3] + String(document.getElementById("O" + (i + 7)).value) + hidden_numbers[i + 6]);
	}

	for (let i = 0; i < 3; i++){
		if(columns[i] < 0){
			Generate();
			return;
		}
		if(rows[i] < 0){
			Generate();
			return;
		}
	}

	for (let i = 0; i < 3; i++){
		document.getElementById("R" + (2*i + 3)).value = rows[i];
		document.getElementById("R" + (2*i + 4)).value = rows[i];
	}

	for (let i = 0; i < 3; i++){
		document.getElementById("R" + i).value = columns[i];
		document.getElementById("R" + (i + 9)).value = columns[i];
	}

	console.log(hidden_numbers);
	console.log(rows);
	console.log(columns);

	console.log((performance.now() - t1) + " ms");
}

function check_math() {

	const t1 = performance.now();

	all.textContent = '0/0';

	const areInputsFilled = Array.from(inputs).every(input => {
		return input.value !== '';
	});

	const areOperatorsFilled = Array.from(operators).every(op => {
		return op.value !== '';
	});

	if (!areInputsFilled) return;
	if (!areOperatorsFilled) return;

	let resultValues = Array.from(document.querySelectorAll('[result-value]')).map(resultValueElement => resultValueElement.value);
	resultValues.unshift(undefined);

	let symbols = Array.from(document.querySelectorAll('[symbol]'))
		.map(symbolElement => symbolElement.value)
		.map(symbol => (symbol == 'x' ? '*' : symbol == 'X' ? '*' : symbol));
	symbols.unshift(undefined);

	let utln, utmn, utrn, umln, ummn, umrn, ubln, ubmn, ubrn;

	let firstEquals = [],
		secondEquals = [],
		thirdEquals = [];

	for (uln = 0; uln < 10; uln++) {
		for (umn = 0; umn < 10; umn++) {
			for (urn = 0; urn < 10; urn++) {
				if (eval(`${uln}${symbols[1]}${umn}${symbols[2]}${urn}==${resultValues[4]}`)) {
					firstEquals.push([uln, umn, urn]);
				}
				if (eval(`${uln}${symbols[6]}${umn}${symbols[7]}${urn}==${resultValues[5]}`)) {
					secondEquals.push([uln, umn, urn]);
				}
				if (eval(`${uln}${symbols[11]}${umn}${symbols[12]}${urn}==${resultValues[6]}`)) {
					thirdEquals.push([uln, umn, urn]);
				}
			}
		}
	}

	solutions = [];
	clickAll = 0;

	for (const fisrtEqual of firstEquals) {
		for (const secondEqual of secondEquals) {
			for (const thirdEqual of thirdEquals) {
				[utln, utmn, utrn] = fisrtEqual;
				[umln, ummn, umrn] = secondEqual;
				[ubln, ubmn, ubrn] = thirdEqual;
				const isSolution =
					eval(`${utln}${symbols[3]}${umln}${symbols[8]}${ubln}==${resultValues[1]}`) &&
					eval(`${utmn}${symbols[4]}${ummn}${symbols[9]}${ubmn}==${resultValues[2]}`) &&
					eval(`${utrn}${symbols[5]}${umrn}${symbols[10]}${ubrn}==${resultValues[3]}`);

				if (isSolution) {
					let solution = [];
					for (let i = 0; i < 3; i++) {
						for (let x = 0; x < 3; x++) {
							const type = x => {
								return x == 0 ? fisrtEqual[i] : x == 1 ? secondEqual[i] : thirdEqual[i];
							};
							solution.push(type(x));
						}
					}
					solutions.push(solution);
				}
			}
		}
	}

	console.log(performance.now() - t1 + "ms");

	if (solutions.length > 0) {
		for (let i = 0; i < 3; i++) {
			for (let x = 0; x < 3; x++) {
				document.getElementById('R' + x + '_' + i).value = solutions[0][x + i * 3];
			}
		}
		all.textContent = 1 + '/' + solutions.length;
	} else {
		for (let i = 0; i < 3; i++) {
			for (let x = 0; x < 3; x++) {
				document.getElementById('R' + x + '_' + i).value = '';
			}
		}
		all.textContent = '0/0';
	}	
}

solverInit();
Generate();
