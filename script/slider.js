const listenToSliderDropdown = () => {
    const arrowIcon = document.querySelector('.js-slider-arrow');
    const sliderBody = document.querySelector('.js-slider-body')

    arrowIcon.addEventListener('change', () => {
        arrowIcon.checked ? sliderBody.classList.remove("c-slider__body--invisible") : sliderBody.classList.add("c-slider__body--invisible");
    })
}

const listenToColorSlider = () => {
    const slider = document.querySelector('.js-color-slider');

    slider.addEventListener('change', () => {
        document.documentElement.style.setProperty('--theme-color-hue', slider.value);
    })
}


document.addEventListener('DOMContentLoaded', () => {
    listenToSliderDropdown();
    listenToColorSlider();
});