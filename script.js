"use strict"

document.addEventListener ("DOMContentLoaded", ()=>{

// Tabs

const tabs = document.querySelectorAll(".tabheader__item");
const tabsContent = document.querySelectorAll(".tabcontent");
const tabsParent = document.querySelector(".tabheader__items");

function hideTabContent(){
    tabsContent.forEach(item=>{
        item.style.display = "none";
    })
    tabs.forEach(item=>{
        item.classList.remove("tabheader__item_active");
    })
}

function showTabContent (i = 0) {
    tabsContent[i].style.display = "block";
    tabs[i].classList.add("tabheader__item_active");
}


tabsParent.addEventListener("click",(event)=>{
    if(event.target && event.target.classList.contains("tabheader__item")){
        tabs.forEach((item,i)=>{
            if(event.target == item){
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
    if(num >= 0 && num < 10){
        return `0${num}`;
    } else {
        return num;
    }
}

function setClock (selector, endtime) {
     const timer = document.querySelector(selector),
     days = timer.querySelector("#days"),
     hours = timer.querySelector("#hours"),
     minutes = timer.querySelector("#minutes"),
     seconds = timer.querySelector("#seconds"),
     timeInterval = setInterval(updateClock,1000);

     updateClock();

     function updateClock() {
         const t = getTimeRemaining(endtime);

         days.innerHTML = getZero(t.days);
         hours.innerHTML = getZero(t.hours);
         minutes.innerHTML = getZero(t.minutes);
         seconds.innerHTML = getZero(t.seconds);

         if(t.total <= 0) {
             clearInterval(timeInterval);
         }

     }
}

setClock(".timer", deadline);


// МОДАЛЬНОЕ ОКНО


const modalBtns = document.querySelectorAll("[data-modal]");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector("[data-close");

modalBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    })
});

function closeModal(){
    modal.style.display = "none";
    document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeModal);


modal.addEventListener("click",(event)=>{
    if(event.target === modal){
        closeModal();
    }
});

document.addEventListener("keydown", (event)=>{
      if(event.code === "Escape" && modal.style.display === "block"){
          closeModal();
      }
});


});


























