const modalItems = document.querySelectorAll('[data-modal]');


if (modalItems.length) {
	modalItems.forEach(button => {
		button.addEventListener('click', () => {

			if (button.dataset.id) {
				setTimeout(() => {
					showModal(button);
				}, 300);
			}
		})
	})
}

function showModal(button) {
	const id = button.dataset.id;
	window.alert(`Identificator: ${id}`);
}