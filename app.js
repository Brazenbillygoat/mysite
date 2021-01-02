
let subTitle = document.getElementById("sub-title");

let messageNum = 0;
const changeSubTitle = () => {
  let subTitles = [
    "a programmer.",
    "curious.",
    "hard-working."
  ];
  // while (true) {
    // debugger
    subTitle.innerText = subTitles[messageNum];

  // };
  messageNum ++;
  if (messageNum > subTitles.length -1) {
    messageNum = 0;
  };
}

setInterval(() => {
  changeSubTitle()
}, 5000);
