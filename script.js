"use strict"

window.addEventListener("DOMContentLoaded", () => {

    // Tabs

    const tabs = document.querySelectorAll(".tabheader__item");
    const tabsContent = document.querySelectorAll(".tabcontent");
    const tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = "none";
        })
        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = "block";
        tabs[i].classList.add("tabheader__item_active");
    }


    tabsParent.addEventListener("click", (event) => {
        if (event.target && event.target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (event.target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })


    hideTabContent();
    showTabContent();






    //Timer 


    const deadline = "2022-05-21";

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector("#hours"),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }

        }
    }

    setClock(".timer", deadline);


    // МОДАЛЬНОЕ ОКНО


    const modalBtns = document.querySelectorAll("[data-modal]");
    const modal = document.querySelector(".modal");


    function openModal() {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        clearInterval(modalTimerId);
    }

    modalBtns.forEach(item => {
        item.addEventListener("click", openModal);
    })

    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }



    modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.getAttribute("data-close") == "") {
            closeModal();
        }
    })

    document.addEventListener("keydown", (event) => {
        if (event.code === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    })

    const modalTimerId = setTimeout(openModal, 3000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);

    // Используем классы для карточек 

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = "menu__item"
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => {
                    element.classList.add(className);
                })
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            
        `;
            this.parent.append(element);
        }
    }

    const getResource = async(url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url} status: ${res.status}`)
        };

        return await res.json();
    };

    /*getResource("http://localhost:3000/menu")
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render()
            });
        });
    */


    // Axios библиотека (замена что выше)

    axios.get("http://localhost:3000/menu")
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render()
            });
        })







    // Forms 

    // <?php 
    //    echo var_dump($_POST); - написать в случае FormData

    const forms = document.querySelectorAll("form");

    const message = {
        loading: "img/spinner.svg",
        success: "Успешно",
        failure: "Ошибка"
    };

    forms.forEach(item => {
        bindPostData(item)
    });

    const postData = async(url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: data
        })

        return await res.json();
    }



    function bindPostData(form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const statusMessage = document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display:block;
            margin:0 auto
            `;
            form.insertAdjacentElement("afterend", statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData("http://localhost:3000/requests", json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                })




        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector(".modal__dialog");
        prevModalDialog.style.display = "none";
        openModal();

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
        <div class= "modal__content">
            <div class = "modal__close" data-close>×</div>
            <div class = "modal__title">${message}</div>
        </div>`
        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            closeModal();
            prevModalDialog.style.display = "block";
        }, 3000)
    }



    // Fetch API (application programming interface)
    // Пример с GET запросом

    /*fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json))
      */

    // ПРИМЕР С ПОСТ ЗАПРОСОМ (НУЖНІ ДОМ НАСТРОЙКИ)

    /*
        fetch('https://jsonplaceholder.typicode.com/posts', {
                method: "POST",
                body: JSON.stringify({ name: "Alex" }),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(response => response.json())
            .then(json => console.log(json));
            */





    // Формы с джейсоном (данные в формате джейсон)

    // В PHP 

    /*<?php 
    $_POST = json_decode(file_get_contents("php://input"),true);
    echo var_dump($_POST);

    const forms = document.querySelectorAll("form");

    const message = {
        loading: "Загрузка!",
        success: "Успешно!!",
        failure: "Ошибка"
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const statusMessage = document.createElement("div");
            statusMessage.classList.add("status");
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();

            request.open("POST", "server.php");
            request.setRequestHeader("Content-type", "application/json;charset=utf-8");
            const formData = new FormData(form);
            const object = {};
            formData.forEach((key,value)=>{
                object[key] = value;
            })
            const json = JSON.stringify(object)
            request.send(json);

            request.addEventListener("load", () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    message.textContent = message.failure;
                }
            })
        })
    }


    */


    // Подробно про npm и проект. JSON-server --------------
    // npm init - инициализировать нпм проект 
    // npm install json-server (-g если глобально)  (--save-dev)
    // npm i установить проекты которые были установлены как у автора (при наличии package.json)
    // json - сервер - сервер по работе с ДЖЕЙСОН
    // npx json-server db.json - запустить джейсон сервер 



    fetch("http://localhost:3000/menu")
        .then(data => data.json())
        .then(res => console.log(res));

    // Получение данных с сервера. Async/Await (ES8)



    // Slider

    const slides = document.querySelectorAll(".offer__slide");
    const prev = document.querySelector(".offer__slider-prev");
    const next = document.querySelector(".offer__slider-next");
    const total = document.querySelector("#total");
    const current = document.querySelector("#current");

    let slideIndex = 1;

    showSlides(slideIndex);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`
    } else {
        total.textContent = slides.length
    }

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach(item => {
            item.style.display = "none";
        });

        slides[slideIndex - 1].style.display = "block";

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex
        }
    }

    function plusSlide(n) {
        showSlides(slideIndex += n)
    };

    next.addEventListener("click", () => {
        plusSlide(1);
    });

    prev.addEventListener("click", () => {
        plusSlide(-1);
    });


    // Калькулятор

    const result = document.querySelector(".calculating__result span");
    let sex, height, weight, age, ratio;

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = "___";
            return;
        }

        if (sex === "female") {
            result.textContent = (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio;
        } else {
            result.textContent = (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio;
        }
    }

    calcTotal();

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        document.querySelector(parentSelector).addEventListener("click", (event) => {
            if (event.target.getAttribute("data-ratio")) {
                ratio = +event.target.getAttribute("data-ratio")
            } else {
                sex = event.target.getAttribute("id");
            }

            console.log(ratio, sex);

            elements.forEach(item => {
                item.classList.remove(activeClass)
            })

            event.target.classList.add(activeClass)
        })
    };

    getStaticInformation("#gender", "calculating__choose-item_active");
    getStaticInformation(".calculating__choose_big", "calculating__choose-item_active");

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener("input", () => {
            switch (input.getAttribute("id")) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
            }
        })
    }












});