// Функция создания карточки
import { openPopup } from "./modal.js";
import { deleteCard, likeCard, unlikeCard } from "./api.js";
let cardTemplate;
let popupImageImage;
let popupImageCaption

export function setCardTemplate(card, imageImage, imageCaption) {
    cardTemplate = card;
    popupImageImage = imageImage;
    popupImageCaption = imageCaption;
}

export function createCard(cardId, title, imageLink, imagePopup, cardOwnerId, authorId, likes) {
    const card = cardTemplate.cloneNode(true);
    
    card.querySelector(".card__title").textContent = title;
    const image = card.querySelector(".card__image");
    image.src = imageLink;
    image.alt = title;

    image.addEventListener('click', () => {
        popupImageImage.src = imageLink;
        popupImageImage.alt = title;
        popupImageCaption.textContent = title;
        openPopup(imagePopup);
    });

    const likeButton = card.querySelector(".card__likes_button"); 
    likes.forEach(like => {
        if(like._id == authorId)
            likeButton.classList.add("card__likes_button_is-active");
    });

    const likeCounter = card.querySelector(".card__likes_counter");
    likeCounter.textContent = likes.length;

    likeButton.addEventListener('click', () => {
        if(likeButton.classList.contains("card__likes_button_is-active")) {
            unlikeCard(cardId).then(res =>{ 
                likeCounter.textContent = res.likes.length;
                likeButton.classList.remove("card__likes_button_is-active");
            }).catch(err => console.log(err));

        } else {
            likeCard(cardId).then(res => {
                likeCounter.textContent = res.likes.length;
                likeButton.classList.add("card__likes_button_is-active");
            }).catch(err => console.log(err));
        }
    });

    const cardDelete = card.querySelector(".card__delete-button");
    if(cardOwnerId == authorId) {
        cardDelete.addEventListener('click', () => {
            deleteCard(cardId)
            .then(() => card.remove())
            .catch(err => console.log(err));
        }); 
    } else {
        card.removeChild(cardDelete);
    }
    return card;
}

