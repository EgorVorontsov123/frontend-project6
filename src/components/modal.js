import { toogleButtonState, hideInputError} from "./validate.js";

function clearForm(popup, settings) {
    const button = popup.querySelector(".popup__button");
    if (button) {
        const inputList =  Array.from(popup.querySelectorAll(settings.inputSelector));
        toogleButtonState(inputList, button, settings);
        const form = popup.querySelector(settings.formSelector);
        inputList.forEach(input => {
            hideInputError(form, input, settings);
        });
        
    }
}

function closeByEsc(evt) {   
    if (evt.key === "Escape") { 
      const openedPopup = document.querySelector('.popup_is-opened');    
      closePopup(openedPopup);    
  } 
}

export function openPopup(popup, settings) {      
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEsc);
    clearForm(popup, settings);
}

export function closePopup(popup) {      
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEsc);
}
