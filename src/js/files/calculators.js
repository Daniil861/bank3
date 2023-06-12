import { getDigFormat, changeCommaToDot } from './functions.js';

export const calcConfig = {
	credits: {
		summ: null,
		time: null,
		percent: null,

		monthPay: null,
		countMoneyOnlyPercents: null,
		summWithAllPercents: null
	},
	hypots: {
		costAppartment: null,
		firstPay: null,
		summ: null,
		time: null,
		percent: null,

		typePay: 1, // 1 - Аннуитетные, 2 - Дифференцированные

		monthPay: null,
		firstMonthPay: null,
		lastMonthPay: null,
		countMoneyOnlyPercents: null,
		summWithAllPercents: null
	}
}

//===
// credit blocks
const monthPayBlock = document.querySelector('[data-res="credit-calc-month-pay"]');
const percentsPayBlock = document.querySelector('[data-res="credit-calc-percents"]');
const allPayBlock = document.querySelector('[data-res="credit-calc-all"]');

const creditResultDataBox = document.querySelector('#credit-calc .bottom-calc-popup__data-box');
const creditEmptyDataBox = document.querySelector('#credit-calc .bottom-calc-popup__empty-data');

//=== 
// hypot bloks
const monthPayBlockHypot = document.querySelector('[data-res="hypot-calc-month-pay"]');
const percentsPayBlockHypot = document.querySelector('[data-res="hypot-calc-percents"]');
const allPayBlockHypot = document.querySelector('[data-res="hypot-calc-all"]');

const hypotResultDataBox = document.querySelector('#hypot-calc .bottom-calc-popup__data-box');
const hypotEmptyDataBox = document.querySelector('#hypot-calc .bottom-calc-popup__empty-data');


export function startCountCreditCalc() {
	// Считываем данные из введенные в инпуты
	const res = getCreditCalcData();

	// Рассчитываем
	if (res) {
		countCredit();
	}
}

function getCreditCalcData() {
	const summ = document.getElementById('credit-calc-summ');
	const time = document.getElementById('credit-calc-time');
	const percent = document.getElementById('credit-calc-percent');

	if (!summ.value || !time.value || !percent.value) {
		creditResultDataBox.classList.add('_hide');
		creditEmptyDataBox.classList.add('_visible');
		return false;
	} else {
		calcConfig.credits.summ = changeCommaToDot(summ.value);
		calcConfig.credits.time = changeCommaToDot(time.value);
		calcConfig.credits.percent = changeCommaToDot(percent.value);

		creditResultDataBox.classList.contains('_hide') ? creditResultDataBox.classList.remove('_hide') : null;
		creditEmptyDataBox.classList.contains('_visible') ? creditEmptyDataBox.classList.remove('_visible') : null;
		return true;
	}
}

function countCredit() {
	const percent = calcConfig.credits.percent / 100 / 12;

	// Рассчитаем ежемесячный платеж только процентов

	let monthPayForPerc = Math.floor(calcConfig.credits.summ * percent * calcConfig.credits.time);
	calcConfig.credits.countMoneyOnlyPercents = getDigFormat(monthPayForPerc);

	// Ежемесячный платеж
	let everyMonthPay = calcConfig.credits.summ * (percent + percent / (((1 + percent) ** calcConfig.credits.time) - 1));
	everyMonthPay = Math.floor(everyMonthPay);
	calcConfig.credits.monthPay = getDigFormat(everyMonthPay);

	// Стоимость кредита - сумма кредита + проценты за весь срок
	calcConfig.credits.summWithAllPercents = getDigFormat(calcConfig.credits.summ + monthPayForPerc);

	writeCreditData();
}

function writeCreditData() {
	console.log('ssssssssss');
	monthPayBlock.textContent = `${calcConfig.credits.monthPay} ₽`;
	percentsPayBlock.textContent = `${calcConfig.credits.countMoneyOnlyPercents} ₽`;
	allPayBlock.textContent = `${calcConfig.credits.summWithAllPercents} ₽`;
}

//========================================================================================================================================================
// hypot

// при клике на один из вариантов рассчетов - снимаем галочку у другого варианта рассчета, чтобы в любом случае можно было выбрать только один
export function changeSelectTypeCountHypot(block) {
	block.checked = false;
}

export function startCountHypotCalc() {
	// Считываем данные из введенные в инпуты
	const res = getHypotCalcData();

	// Рассчитываем
	if (res && calcConfig.hypots.typePay === 1) { // Если Аннуитетный тип рассчета
		countAnnuetHypot();
	} else if (res && calcConfig.hypots.typePay === 2) { // если Дифференцированный тип рассчета
		countDiffHypot();
	}
}

function getHypotCalcData() {
	const costAppartment = document.getElementById('hypot-calc-cost-appartment');
	const firstPay = document.getElementById('hypot-calc-first-summ');
	const summ = document.getElementById('hypot-calc-summ');
	const time = document.getElementById('hypot-calc-time');
	const percent = document.getElementById('hypot-calc-percent');

	if (!costAppartment.value || !firstPay.value || !summ.value || !time.value || !percent.value) {
		hypotResultDataBox.classList.add('_hide');
		hypotEmptyDataBox.classList.add('_visible');

		return false;
	} else {
		calcConfig.hypots.costAppartment = changeCommaToDot(costAppartment.value);
		calcConfig.hypots.firstPay = changeCommaToDot(firstPay.value);
		calcConfig.hypots.summ = changeCommaToDot(summ.value);
		calcConfig.hypots.time = changeCommaToDot(time.value);
		calcConfig.hypots.percent = changeCommaToDot(percent.value);

		hypotResultDataBox.classList.contains('_hide') ? hypotResultDataBox.classList.remove('_hide') : null;
		hypotEmptyDataBox.classList.contains('_visible') ? hypotEmptyDataBox.classList.remove('_visible') : null;
		return true;
	}
}

function countAnnuetHypot() {
	// Ежемесячная ставка
	const monthRate = calcConfig.hypots.percent / 12 / 100;

	//=====================================
	// размер ежемесячного платежа

	// 1. Срок ипотеки в месяцах

	const timeInMonths = calcConfig.hypots.time * 12;

	// 2. Общая ставка
	const rate = (1 + monthRate) ** timeInMonths;

	// 3. Ежемесячные платеж
	const monthPay = Math.floor(calcConfig.hypots.summ * (monthRate * rate / (rate - 1)));
	calcConfig.hypots.monthPay = getDigFormat(monthPay);

	//=====================================
	// переплата процентов

	const countMoneyOnlyPercents = (monthPay * timeInMonths) - calcConfig.hypots.summ;

	calcConfig.hypots.countMoneyOnlyPercents = getDigFormat(countMoneyOnlyPercents);

	//=====================================
	// Итого стоимость ипотеки - изначальная сумма + сумма всего за проценты

	calcConfig.hypots.summWithAllPercents = getDigFormat(calcConfig.hypots.summ + countMoneyOnlyPercents);

	writeHypotData();
}


function countDiffHypot() {
	// Ежемесячная процентная ставка
	const monthRate = calcConfig.hypots.percent / 12 / 100;

	//=====================================
	// размер ежемесячного платежа

	// 1. Срок ипотеки в месяцах

	const timeInMonths = calcConfig.hypots.time * 12;

	// 2. Общая ставка - столько ежемесячно платим по основному долгу
	const monthPayWithoutPercents = Math.floor(calcConfig.hypots.summ / timeInMonths);

	// 3. Сумма процентов в месяц
	const monthPayPercentFirst = Math.floor(calcConfig.hypots.summ * monthRate);

	const monthPayPercentFunc = countPercents(calcConfig.hypots.summ, timeInMonths, monthPayWithoutPercents, monthRate);
	const monthPayPercent = monthPayPercentFunc();

	// 4. Ежемесячный платеж
	const firstMonthPay = monthPayWithoutPercents + monthPayPercentFirst;
	const lastMonthPay = monthPayWithoutPercents + monthPayPercent.lastPayPercents;
	calcConfig.hypots.firstMonthPay = getDigFormat(firstMonthPay);
	calcConfig.hypots.lastMonthPay = getDigFormat(lastMonthPay);

	//=====================================
	// переплата процентов

	const countMoneyOnlyPercents = monthPayPercent.allSummPercent;

	calcConfig.hypots.countMoneyOnlyPercents = getDigFormat(countMoneyOnlyPercents);

	//=====================================
	// Итого стоимость ипотеки - изначальная сумма + сумма всего за проценты

	calcConfig.hypots.summWithAllPercents = getDigFormat(calcConfig.hypots.summ + countMoneyOnlyPercents);

	writeHypotData();
}

// Рекурсия - проходим по всем месяцам ипотеки и рассчитываем размер уплаты процентов (с каждым платежом размер уменьшается)
function countPercents(summ, months, monthPay, monthRate) {
	let countAllPercent = 0;
	let lastSumm = 0;
	let startSumm = summ;
	let diffSumm = startSumm;
	let diffMonths = months;

	return function rec() {
		// Узнали сумму процентов в этом месяце, есходя из актуального остатка
		let currentMonthPercentCount = diffSumm * monthRate;

		// Добавили в счетчик всех процентов
		countAllPercent += currentMonthPercentCount;

		// Вычитаем равномерный платеж по ипотеке
		diffSumm -= monthPay;

		// Снизили количество месяцев
		diffMonths--;
		if (diffMonths === 0) lastSumm = Math.floor(currentMonthPercentCount);

		// Проверяем - если месяцы не закончились, делаем рассчет снова (рекурсия)
		if (diffMonths > 0) return rec();

		return {
			allSummPercent: countAllPercent,
			lastPayPercents: lastSumm
		}
	}
}

function writeHypotData() {
	if (calcConfig.hypots.typePay === 2) monthPayBlockHypot.textContent = `${calcConfig.hypots.firstMonthPay} ₽ ... ${calcConfig.hypots.lastMonthPay} ₽`;
	else monthPayBlockHypot.textContent = `${calcConfig.hypots.monthPay} ₽`;

	percentsPayBlockHypot.textContent = `${calcConfig.hypots.countMoneyOnlyPercents} ₽`;
	allPayBlockHypot.textContent = `${calcConfig.hypots.summWithAllPercents} ₽`;
}