import {
	initStartData, favoriteConfig, checkAvailabilityFavoriteItem, removeSelectedFavorite, searchDataHandler, checkEmptyfavoriteBlock,
	removeItemFromFavoriteScreen, cloneCurrentItemAndDrawToFavorite, addRemoveNumberForStorrage, configSearch, filterCreditCards, filterDebetCards
} from './script.js';
import { configMain } from './mainData.js';
import { calcConfig, startCountCreditCalc, changeSelectTypeCountHypot, startCountHypotCalc } from './calculators.js';
// import { initModalButtons } from './modal.js';

const privacyCheckbox = document.getElementById('c_2');
const textNotifications = document.querySelector('.profile__notif');
const nameInput = document.querySelector('.input-start-screen__name');
const lastNameInput = document.querySelector('.input-start-screen__lastName');
const profileName = document.querySelector('.header__name');
const mainTitleName = document.querySelector('.calc-box__title');


// Объявляем слушатель событий "клик"

document.addEventListener('click', (e) => {
	let targetElement = e.target;

	if (targetElement.closest('[data-btn="privacy-to-main"')) {
		location.href = 'index.html';
	}

	//======
	// profile

	if (targetElement.closest('[data-btn="change-name"]')) {
		const headerName = document.querySelector('.header__name');
		headerName.focus();
		headerName.classList.remove('_hold');
	}

	if (profileName && !targetElement.closest('.header__name') && !targetElement.closest('[data-btn="change-name"]') && !profileName.classList.contains('_hold')) {
		profileName.classList.add('_hold');
	}

	if (targetElement.closest('[data-btn="notifications"]')) {
		configMain.notifications = !configMain.notifications;

		changeStateNotifications();
	}

	if (targetElement.closest('[data-btn="privacy"]')) {
		localStorage.setItem('previus-page', 'privacy');
		location.href = 'privacy.html';
	}

	//======

	if (targetElement.closest('[data-btn="show-iframe"]')) {
		const modal = document.querySelector('.frame-wrapper__modal');

		if (modal && !modal.classList.contains('_visible')) {
			modal.classList.add('_visible');
		}
	}

	//===
	// calcs

	if (targetElement.closest('[data-btn="credit-calc"]')) {
		startCountCreditCalc();
	}

	if (targetElement.closest('[data-btn="hypot-calc"]')) {
		startCountHypotCalc();
	}

	if (targetElement.closest('#c_8')) {
		changeSelectTypeCountHypot(document.getElementById('c_9'));
		calcConfig.hypots.typePay = 1;
	}
	if (targetElement.closest('#c_9')) {
		changeSelectTypeCountHypot(document.getElementById('c_8'));
		calcConfig.hypots.typePay = 2;
	}

	//===
	// filters
	if (targetElement.closest('#c_3') || targetElement.closest('#c_4')) {
		filterCreditCards();
	}

	if (targetElement.closest('#c_5') || targetElement.closest('#c_6') || targetElement.closest('#c_7')) {
		filterDebetCards();
	}

	//===
	// favorite logic

	if (targetElement.closest('.header-item-product__favorite')) {

		const number = +targetElement.closest('[data-prod]').dataset.prod;
		const group = targetElement.closest('[data-prod]').dataset.itemChild;

		const isAlredyFavorit = checkAvailabilityFavoriteItem(number);

		if (isAlredyFavorit) { // Если блок уже в массиве избранных

			// Вешаем класс _selected на блок, чтобы изменить цвет и иконку в слове "Избранное"
			targetElement.closest('.header-item-product__favorite').classList.remove('_selected');

			// Удаляем со страницы избранного блок с номером
			removeItemFromFavoriteScreen(number);

			// Удаляем число из массива избранных блоков
			addRemoveNumberForStorrage(number, true);

			removeSelectedFavorite();
		} else {
			// Вешаем класс _selected на блок, чтобы изменить цвет и иконку в слове "Избранное"
			targetElement.closest('.header-item-product__favorite').classList.add('_selected');

			//	Клонируем блок и записываем его на страницу избранных блоков
			cloneCurrentItemAndDrawToFavorite(targetElement.closest('[data-prod'), group);

			// Добавляем новое число в массив избранных блоков
			addRemoveNumberForStorrage(number, false);
		}

		checkEmptyfavoriteBlock(group);
		// initModalButtons();
	}

	//===
	// search

	if (targetElement.closest('.header__icon-search')) {
		const parent = targetElement.closest('.header__search');
		configSearch.prompt = parent.querySelector('input').value;
		parent.querySelector('input').value = '';

		document.querySelector('#search-box .header__input').value = configSearch.prompt;
		searchDataHandler(configSearch.prompt);
	}
})


// Когда пользователь вводит данные при входе - записываем в сессионную память и далее используем эти данные
if (nameInput) {
	nameInput.addEventListener('change', (e) => {
		configMain.user.name = e.target.value;
		localStorage.setItem('user-name', configMain.user.name);
		mainTitleName.textContent = `Привет, ${localStorage.getItem('user-name')}!`;
	})
}

if (lastNameInput) {
	lastNameInput.addEventListener('change', (e) => {
		configMain.user.lastName = e.target.value;
		localStorage.setItem('user-last-name', configMain.user.lastName);
	})
}

if (profileName) {
	profileName.addEventListener('change', (e) => {
		const data = e.target.value;

		const arr = data.split(' ');
		configMain.user.name = arr[0];
		configMain.user.lastName = arr[1];

		localStorage.setItem('user-name', configMain.user.name);
		localStorage.setItem('user-last-name', configMain.user.lastName);

		initStartData();
	})
}


function changeStateNotifications() {
	configMain.notifications ? textNotifications.textContent = 'Вкл.' : textNotifications.textContent = 'Выкл.';
}







