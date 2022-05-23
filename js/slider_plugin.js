'use strict';

const plg = {};

plg.sliderCreate = ({containerSelector, content, buttonsShow = true, slidesClass, buttonsClass, containerClass, slidesReverseOrder = false}) => {
    let slideDirection = 'forward'
    let slideCount = content.length
    let slideNumber = 0;

    function slideCreate(content) {
        const createdSlides = content.map(c => {
            const slide = document.createElement('div')
            slide.insertAdjacentHTML('afterbegin', c)
            slide.classList.add('slide')
            if (slidesClass) slide.classList.add(slidesClass)
            return slide
        })
        if (!Array.isArray(createdSlides)) {createdSlides = Array.from(createdSlides)}
        return createdSlides
    }

    function buttons() {
        if (!buttonsShow){
            return {bPrevious: '', bNext: ''}
        }

        const bPrevious = document.createElement('div');
        const bNext = document.createElement('div');
        bPrevious.classList.add('slider-button-previous')
        bNext.classList.add('slider-button-next')
        if (buttonsClass) {
            buttonsClass.forEach(c => {
                bPrevious.classList.add(c)
                bNext.classList.add(c)
            })
        }
        
        return {bPrevious, bNext}
    }
    
    const containers = document.querySelectorAll(containerSelector);

    if (containers.length !== 1) {
        throw new Error('Not unique identificator')
    }

    const container = containers[0];

    if (containerClass) {
        containerClass.forEach(c => {
            container.classList.add(c)
        })
    }
    if (slidesReverseOrder) {slideCreate(content).forEach(s => container.insertAdjacentElement('afterbegin', s))}
    else {slideCreate(content).forEach(s => container.insertAdjacentElement('beforeend', s))}

    const b = buttons()
    const buttonNext = b.bNext
    const buttonPrevious = b.bPrevious
    container.append(buttonPrevious, buttonNext)

    const slides = container.querySelectorAll('.slide')

    if (content.length === 1) {
        slides[0].classList.add('slide-active');
        buttonPrevious.classList?.add('inactive-button');
        buttonNext.classList?.add('inactive-button');
    } else if (content.length > 1) {
        slides.forEach(i => {i.classList.add('slide-next')})
        slides[0].classList.remove('slide-next');
        slides[0].classList.add('slide-active');
        buttonPrevious.classList?.add('inactive-button');
    }

    //Обработчик клика Следующий слайд
    const slideNext = () => {
        slides[slideNumber].classList.toggle('slide-active');
        slides[slideNumber].classList.add('slide-previous');
        slides[slideNumber + 1].classList.remove('slide-next');
        slides[slideNumber + 1].classList.toggle('slide-active');
        buttonPrevious.classList?.remove('inactive-button');
        ++slideNumber
        --slideCount
        if (slides[slideNumber + 1]){
            buttonNext.classList?.remove('inactive-button');
        } else if (!slides[slideNumber + 1]) {
            buttonNext.classList?.add('inactive-button');
        };
    };
    
    //Обработчик клика Предыдущий слайд
    const slidePrevious = () => {
        slides[slideNumber].classList.toggle('slide-active');
        slides[slideNumber].classList.add('slide-next');
        slides[slideNumber - 1].classList.remove('slide-previous');
        slides[slideNumber - 1].classList.toggle('slide-active');
        buttonNext.classList?.remove('inactive-button');
        --slideNumber
        ++slideCount
        if (slides[slideNumber - 1]){
            buttonPrevious.classList?.remove('inactive-button');
        } else if (!slides[slideNumber - 1]) {
            buttonPrevious.classList?.add('inactive-button');
        };
    };

    //Функция таймера, переключает слайды с начала в конец и обратно
    //Переделай на тернарные oElem.style.color = oElem.style.color == 'red' ? 'blue' : 'red';
    const sliderTimer = (interval) => {
        const func = () => {
            if (content.length === 1) {
                throw new Error('This slider have only one slide')
            }
            if (slideDirection === 'forward') {
                if (slideCount > 1){
                    slideNext();
                } else if (slideCount === 1){
                    slideDirection = 'backward';
                    slidePrevious();
                };
            } else if (slideDirection === 'backward') {
                if (slideCount < content.length){
                    slidePrevious();
                }else if (slideCount === content.length){
                    slideDirection = 'forward';
                    slideNext();
                };
            };
        }
        let timer = setInterval(func, interval)

        const stopSlider = () => clearInterval(timer);
        const startSlider = () => {timer = setInterval(func, interval)};

        return {stopSlider, startSlider}
    };

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('slider-button-next')) {
            e.stopPropagation()
            slideNext(e)
        } else if (e.target.classList.contains('slider-button-previous')) {
            e.stopPropagation()
            slidePrevious(e)
        }
    })
    
    return {
        slideNext,
        slidePrevious,
        sliderTimer,
        container
    }
};