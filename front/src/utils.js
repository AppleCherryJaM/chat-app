import { avatar as img } from "./assets/images/images";

const formatDate = (date, options) => {
	switch (options) {
		case 'chat':
			const newDate = new Date(date);
			const year = newDate.getFullYear();
			const month = String(newDate.getMonth() + 1).padStart(2, '0');
			const day = String(newDate.getDate()).padStart(2, '0');
			const hours = String(newDate.getHours()).padStart(2, '0');
			const minutes = String(newDate.getMinutes()).padStart(2, '0');
			return `${year}/${month}/${day} ${hours}:${minutes}`;
		case 'message':
			break;
		default:
			return null;
	}
};

const chooseAvatar = (avatar) => {
	switch (avatar) {
		case 'avatar':
			return img;
	}
};

export { formatDate, chooseAvatar };