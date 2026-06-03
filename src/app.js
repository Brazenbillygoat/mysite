
// SETTING UP MY POPUP VIDEOS
$(document).ready(function() {
  $(".popup").magnificPopup({
    type: "iframe"
  })
})

// CHANGING FONT ON LANDING PAGE
let subTitle = document.getElementById("sub-title");

let messageNum = 0;
const changeSubTitle = () => {
  let subTitles = [
    "passionate.",
    "systems thinker.",
    "integration builder.",
    "software engineer."
  ];
  setTimeout(() => {
    subTitle.style.opacity = 1;
    subTitle.innerText = subTitles[messageNum];
  }, 1000);
  messageNum ++;
  if (messageNum > subTitles.length -1) {
    messageNum = 0;
  };
}

setInterval(() => {
  subTitle.style.opacity = 0;
  changeSubTitle();
}, 4000);
