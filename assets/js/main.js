/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
   const toggle = document.getElementById(toggleId),
         nav = document.getElementById(navId)

   toggle.addEventListener('click', () =>{
       // Add show-menu class to nav menu
       nav.classList.toggle('show-menu')

       // Add show-icon to show and hide the menu icon
       toggle.classList.toggle('show-icon')
   })
}

showMenu('nav-toggle','nav-menu');

var className = "inverted";
var scrollTrigger = 170;

window.onscroll = function () {
    if (window.scrollY >= scrollTrigger || window.pageYOffset >= scrollTrigger) {
        document.getElementsByTagName("header")[0].classList.add(className);
    } else {
        document.getElementsByTagName("header")[0].classList.remove(className);
    }
};

var imgs = Array.from(document.getElementsByClassName("portfolioImg"));
var lightBoxContainer = document.getElementById("lightBoxContainer");
var boxContent = document.getElementById("boxContent");
var closeBtn = document.getElementById("close");
var next = document.getElementById("next");
var prev = document.getElementById("prev");
var currentIndex = 0;

for (let i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener("click", function (e) {
        showLightBox(i);
        currentIndex = imgs.indexOf(e.target);
        console.log(currentIndex);
    });
}
closeBtn.addEventListener("click", hideLightBox);
next.addEventListener("click", showNext);
prev.addEventListener("click", showPrev);
document.addEventListener("keydown", function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 27) {
        hideLightBox();
    } else if (e.keyCode == 39) {
        showNext();
    } else if (e.keyCode == 37) {
        showPrev();
    }
});
document.addEventListener("click", function (e) {
    if (e.target == lightBoxContainer) {
        hideLightBox();
    }
});

function showLightBox(index) {
    var picSrc = imgs[index].getAttribute("src");
    boxContent.style.cssText = `background-image:url(${picSrc})`;
    lightBoxContainer.classList.remove("d-none");
    document.querySelector("body").classList.add("overflow-hidden");
}
function hideLightBox() {
    lightBoxContainer.classList.add("d-none");
    document.querySelector("body").classList.remove("overflow-hidden");
}
function showNext() {
    currentIndex++;
    if (currentIndex == imgs.length) {
        currentIndex = 0;
    }
    var picSrc = imgs[currentIndex].getAttribute("src");
    boxContent.style.cssText = `background-image:url(${picSrc})`;
}

function showPrev() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = imgs.length - 1;
    }
    var picSrc = imgs[currentIndex].getAttribute("src");
    boxContent.style.cssText = `background-image:url(${picSrc})`;
}