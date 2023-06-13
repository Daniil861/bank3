import debounce from "lodash.debounce";

import { configMain } from "./mainData.js";

const nameInput = document.querySelector('.input-start-screen__name');
const lastNameInput = document.querySelector('.input-start-screen__lastName');
const mainTitleName = document.querySelector('.calc-box__title');
const profileName = document.querySelector('.header__name');

export function initStartData() {
	if (sessionStorage.getItem('user-name') && nameInput) {
		nameInput.value = sessionStorage.getItem('user-name');
		mainTitleName.textContent = `Привет, ${sessionStorage.getItem('user-name')}!`;
		configMain.user.name = sessionStorage.getItem('user-name');
	}

	if (sessionStorage.getItem('user-last-name') && lastNameInput) {
		lastNameInput.value = sessionStorage.getItem('user-last-name');
		configMain.user.lastName = sessionStorage.getItem('user-last-name');
	}

	if (sessionStorage.getItem('privacy') && document.querySelector('.main')) {
		document.querySelector('.start-screen').classList.add('_hide');
		document.querySelector('.main').classList.remove('_hide');
	}

	if (configMain.user.name && configMain.user.lastName) {
		writeUserDataToConfig();
	}

	if (profileName && configMain.user.fullName) {
		profileName.value = configMain.user.fullName;
	}

	if (!sessionStorage.getItem('previus-page')) {
		sessionStorage.setItem('previus-page', 'start');
	} else if (document.querySelector('[data-person-tab]') && sessionStorage.getItem('previus-page') && sessionStorage.getItem('previus-page') == 'privacy') {
		document.querySelector('[data-person-tab]').classList.add('_tab-active');
		document.querySelector('[data-start-tab]').classList.remove('_tab-active');
		sessionStorage.setItem('previus-page', 'start');
	}
}

export function writeUserDataToConfig() {
	configMain.user.fullName = `${configMain.user.name} ${configMain.user.lastName}`;
}

export function showMainScreen() {
	document.querySelector('.main').classList.remove('_hide');
	sessionStorage.setItem('privacy', true);

	if (profileName && configMain.user.fullName) {
		profileName.value = configMain.user.fullName;
	}
}

initStartData();

//========================================================================================================================================================
// favorite

export const favoriteConfig = {
	arrFavoriteProducts: []
}

const favoriteItems = document.querySelector('.favorite__items');

// Проверяем есть ли в массиве продукт, по которому сейчас кликнули. Если нет - добавляем, если есть - удаляем.
export function checkAvailabilityFavoriteItem(number) {
	if (favoriteConfig.arrFavoriteProducts.includes(number)) {
		return true;
	} else {
		return false;
	}
}

//  Проверяем есть ли в массиве продукт, по которому сейчас кликнули. Если нет - добавляем, если есть - удаляем.
export function addRemoveNumberForStorrage(number, status) {
	if (status) {
		const pos = favoriteConfig.arrFavoriteProducts.indexOf(number);
		favoriteConfig.arrFavoriteProducts.splice(pos, 1);
	} else {
		favoriteConfig.arrFavoriteProducts.push(number);
	}
}

export function cloneCurrentItemAndDrawToFavorite(item, group) {
	const newItem = item.cloneNode(true);

	const parent = document.querySelector(`[data-item-parent="${group}"]`);

	parent.append(newItem);
}

export function removeItemFromFavoriteScreen(number) {
	const favoriteItemsProducts = document.querySelectorAll('.favorite__items .item-product');

	favoriteItemsProducts.forEach(item => {
		if (item.dataset.prod == number && item.closest('.favorite__items')) {
			item.remove();
		}
	})
}

export function removeSelectedFavorite() {
	const favoriteItemsAll = document.querySelectorAll('[data-prod]');


	const arr = Array.from(favoriteItemsAll);
	const newArr = [];

	arr.forEach(block => {
		if (block.querySelector('.header-item-product__favorite').classList.contains('_selected')) newArr.push(block);
	})

	newArr.forEach(block => {
		if (!favoriteConfig.arrFavoriteProducts.includes(+block.dataset.prod)) {
			block.querySelector('.header-item-product__favorite').classList.remove('_selected');
		}

	})


}

export function checkEmptyfavoriteBlock(group) {
	const parent = document.querySelector(`[data-item-parent="${group}"]`);

	const item = parent.querySelector('.item-product');

	if (item) {
		parent.classList.add('_hide-empty');
	} else {
		parent.classList.remove('_hide-empty');
	}
}

//========================================================================================================================================================
// filter credit cards
const creditCardsItems = document.querySelectorAll('#credit-cards .item-product');

export function filterCreditCards() {
	const free = document.getElementById('c_3').checked;
	const cashback = document.getElementById('c_4').checked;

	creditCardsItems.forEach(block => block.classList.remove('_hide'));

	if (free && cashback) {
		creditCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
			if (block.dataset.cash == undefined) block.classList.add('_hide');
		})
	} else if (free && !cashback) {
		creditCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
		})
	} else if (!free && cashback) {
		creditCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
		})
	}

}

//========================================================================================================================================================
// filter credit cards
const debetCardsItems = document.querySelectorAll('#debet-cards .item-product');

export function filterDebetCards() {
	const cashback = document.getElementById('c_5').checked;
	const pay = document.getElementById('c_6').checked;
	const free = document.getElementById('c_7').checked;

	debetCardsItems.forEach(block => block.classList.remove('_hide'));

	if (cashback && free && pay) {
		debetCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
			if (block.dataset.free == undefined) block.classList.add('_hide');
			if (block.dataset.pay == undefined) block.classList.add('_hide');
		})
	} else if (cashback && free && !pay) {
		debetCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
			if (block.dataset.free == undefined) block.classList.add('_hide');
		})
	} else if (cashback && !free && pay) {
		debetCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
			if (block.dataset.pay == undefined) block.classList.add('_hide');
		})
	} else if (!cashback && free && pay) {
		debetCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
			if (block.dataset.pay == undefined) block.classList.add('_hide');
		})
	} else if (cashback && !free && !pay) {
		debetCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
		})
	} else if (!cashback && free && !pay) {
		debetCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
		})
	} else if (!cashback && !free && pay) {
		debetCardsItems.forEach(block => {
			if (block.dataset.pay == undefined) block.classList.add('_hide');
		})
	}

}

//========================================================================================================================================================
// search
export const configSearch = {
	prompt: null
}
const searchItems = document.querySelectorAll('#search-box .item-product');

// Функция - запуск функции поиска значения с отсрочкой 0,5 сек
const debounceHandler = debounce((data) => {
	searchDataHandler(data);
}, 500)


// Функция запускает обработку вводимой информации в инпут поиска города
export const searchDataHandler = (string) => {
	// Запускаем проверку городов только если не пустая строка, если пустая - обнуляем последний поиск чтобы очистить блок с городами
	if (string) {
		findDataHandler(string.toLowerCase())
	}
}

// Функция - обработчик вводимой информации в инпут поиска
const inputHandler = (e) => {
	if (e.target.value.length > 2) {
		debounceHandler(e.target.value);
	} else {
		hideAllsearchItems();
	}
}

function findDataHandler(string) {

	hideAllsearchItems();

	searchItems.forEach(item => {
		let words = item.dataset.words;
		words = words.split(',');

		words.forEach(word => {
			if (word.indexOf(string) !== -1) {
				item.classList.remove('_hide');
			}
		})
	})
}

function hideAllsearchItems() {
	searchItems.forEach(item => item.classList.add('_hide'));
}

if (document.querySelector('#search-box .header__input')) {
	document.querySelector('#search-box .header__input').addEventListener('input', inputHandler);
}
