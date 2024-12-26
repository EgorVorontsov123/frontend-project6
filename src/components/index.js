import "../pages/index.css";
import { enableValidation,  } from "./validate.js";
import { createCard, setCardTemplate } from './card.js';
import { openPopup, closePopup } from "./modal.js";
import { getInitialCards, getProfile, editProfile, addCard, editAvatar } from "./api.js";

let ownerId;

const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_state_error',
    errorClass: 'popup__input-error_visible'
};


// Создание объекта с настройками валидации
enableValidation(validationSettings);

const cardContainer = document.querySelector(".places__list");

// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content
const cardElement = cardTemplate.querySelector(".card");


// Поп-ап картинки
const imagePopup = document.querySelector(".popup_type_image");
const popupImageImage = imagePopup.querySelector(".popup__image");
const popupImageCaption = imagePopup.querySelector(".popup__caption");
const popupImageCloseButton = imagePopup.querySelector(".popup__close");

// Форма редактирования профиля пользователя
const profilePopup = document.querySelector(".popup_type_edit");

const editProfileButton = document.querySelector(".profile__edit-button");
const popupProfileName = profilePopup.querySelector(".popup__input_type_name");
const popupProfileDescription = profilePopup.querySelector(".popup__input_type_description");
const profileNameElement =  document.querySelector(".profile__title");
const profileDescriptionElement = document.querySelector(".profile__description");
const profileImageElement = document.querySelector(".profile__image");
const popupProfileCloseButton = profilePopup.querySelector(".popup__close");
const profileFormElement = profilePopup.querySelector(".popup__form");
const popupProfileButton = profilePopup.querySelector(".popup__button");

// Поп-ап аватарки
const editAvatarPopup = document.querySelector(".popup_type_edit-avatar"); 
const editAvatarFormElement = editAvatarPopup.querySelector(".popup__form");
const popupEditAvatarCloseButton = editAvatarPopup.querySelector(".popup__close");
const popupAvatarLinkElement = editAvatarPopup.querySelector(".popup__input_type_url");
const popupAvatarButton = editAvatarPopup.querySelector(".popup__button");

// Форма добавления карточки
const cardPopup = document.querySelector(".popup_type_new-card");
const addCardButton = document.querySelector(".profile__add-button");

const popupCardCloseButton = cardPopup.querySelector(".popup__close");
const popupCardFormElement = cardPopup.querySelector(".popup__form");

const popupCardName = cardPopup.querySelector(".popup__input_type_card-name");
const popupCardLink = cardPopup.querySelector(".popup__input_type_url");
const popupCardButton = cardPopup.querySelector(".popup__button");

setCardTemplate(cardElement, popupImageImage, popupImageCaption);

// Поп-ап картинки
imagePopup.addEventListener('mousedown', evt => {
    if (evt.target == imagePopup) {
        closePopup(imagePopup);
    }
});

popupImageCloseButton.addEventListener('click', () => {
    closePopup(imagePopup);
});


profileImageElement.addEventListener("click", () =>{
    openPopup(editAvatarPopup, validationSettings);
});


// Поп-ап аватарки
editAvatarFormElement.addEventListener("submit", evt =>{
    evt.preventDefault();
    popupAvatarButton.textContent = "Сохранение...";
    editAvatar(popupAvatarLinkElement.value).then(res => {
        profileImageElement.style.backgroundImage = `url('${res.avatar}')`
        closePopup(editAvatarPopup);
        popupAvatarLinkElement.value = "";
    })
    .catch(err => console.log(err))
    .finally(() => {
        popupAvatarButton.textContent = "Сохранение";
    });

});

popupEditAvatarCloseButton.addEventListener("click", () => closePopup(editAvatarPopup));
editAvatarPopup.addEventListener('mousedown', evt => {
    if(evt.target == editAvatarPopup) {
        closePopup(editAvatarPopup);
    }
});


// Поп-ап профиля

editProfileButton.addEventListener('click', () => {
    popupProfileName.value = profileNameElement.textContent;
    popupProfileDescription.value = profileDescriptionElement.textContent;
    openPopup(profilePopup, validationSettings);
});

profilePopup.addEventListener('mousedown', evt => {
    if(evt.target == profilePopup) {
        closePopup(profilePopup);
    }
});

popupProfileCloseButton.addEventListener('click', () => {
    closePopup(profilePopup);
});

profileFormElement.addEventListener('submit', e => {
    e.preventDefault();

    popupProfileButton.textContent = "Сохранение...";
    editProfile(popupProfileName.value, popupProfileDescription.value).then(res => {
        profileNameElement.textContent = res.name;
        profileDescriptionElement.textContent = res.about;

        closePopup(profilePopup);
    })
    .catch(err => console.log(err))
    .finally(() => {
        popupProfileButton.textContent = "Сохранение";
    });
});

// Поп-ап новой карточки

function closeCardPopup() {
    closePopup(cardPopup);
    popupCardName.value = "";
    popupCardLink.value = "";
}

cardPopup.addEventListener('mousedown', evt => {
    if(evt.target == cardPopup) {
        closeCardPopup();
    }
});

addCardButton.addEventListener('click', () => {
    openPopup(cardPopup, validationSettings);
});


popupCardCloseButton.addEventListener('click', closeCardPopup);

popupCardFormElement.addEventListener('submit', e => {
    e.preventDefault();
    popupCardButton.textContent = "Сохранение...";

    addCard(popupCardName.value, popupCardLink.value).then(element => {
        const card = createCard(element._id, element.name, element.link, imagePopup, element.owner._id,  ownerId, element.likes);
        cardContainer.prepend(card);

        closeCardPopup();
    })
    .catch(err => console.log(err))
    .finally(() =>         
        popupCardButton.textContent = "Сохранение"
    );
});

// Запросы
Promise.all([getProfile(), getInitialCards()]).then(res => {
    const profile = res[0];
    const initialCards = res[1];
    ownerId = profile._id;
    profileNameElement.textContent = profile.name;
    profileDescriptionElement.textContent = profile.about;
    profileImageElement.style.backgroundImage = `url('${profile.avatar}')`
    // Вывести карточки на страницу
    initialCards.forEach(element => {
        const card = createCard(element._id, element.name, element.link, imagePopup, element.owner._id,  ownerId, element.likes);
        cardContainer.append(card);
    });
}).catch(err => console.log(err));
