export function hideInputError(form, input, settings) {
    const errorElement = form.querySelector(`.${input.name}-input-error`);
    input.classList.remove(settings.inputErrorClass);
    errorElement.textContent = "";
    errorElement.classList.remove(settings.errorClass);
}

function showInputError(form, input, errorMessage, settings) {
    const errorElement = form.querySelector(`.${input.name}-input-error`);
    input.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
}

function checkInputValidity(form, input, settings) {
    if(!input.validity.valid) {
        showInputError(form, input, input.validationMessage, settings);
    } else {
        hideInputError(form, input, settings);
    }
}

function hasInvalidInput(inputList){
    return inputList.some((input => {
        return !input.validity.valid;
    }));
}

export function toogleButtonState(inputList, button, settings) {
    if(hasInvalidInput(inputList)) {
        button.classList.add(settings.inactiveButtonClass);
    } else {
        button.classList.remove(settings.inactiveButtonClass);
    }
}

function setEventListeners(form, settings) {
    const inputList = Array.from(form.querySelectorAll(settings.inputSelector));
    const button = form.querySelector(settings.submitButtonSelector);
    inputList.forEach(input => {
        input.addEventListener("input", () => {
            toogleButtonState(inputList, button, settings);
            checkInputValidity(form, input, settings);
        });
    })
    form.addEventListener("submit", e => {
        if(hasInvalidInput(inputList)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            inputList.forEach(input => {
                checkInputValidity(form, input, settings);
            })
        }
    });
}

export function enableValidation(settings) {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));
    formList.forEach(form => {
        setEventListeners(form, settings);
    });
}