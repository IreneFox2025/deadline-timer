const inp = document.querySelector("#inp_deadline");
const button = document.querySelector("#set_deadline_button");

let deadLine;

const setDeadline = () => {
  if (!inp.value) {
    alert("Enter your deadline");
  } else {
    deadLine = inp.value.replace(/T/g, " ");
  }
  localStorage.setItem("deadline", deadLine);

  clearInterval(timer);
  timer = setInterval(renderResult, 1000);
};

button.addEventListener("click", setDeadline);

const getTimeRemaining = (endTime) => {
  const total = Date.parse(endTime) - Date.parse(new Date());
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((total / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((total / 1000) % 60)
    .toString()
    .padStart(2, "0");

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

let timer;

let timers = document.querySelector(".timers");
const dl_modal = document.querySelector("#dl_modal");
const notification = new Audio("audio/new-notification.mp3");
let audioUnlocked = false;

document.addEventListener(
  "click",
  () => {
    if (!audioUnlocked) {
      notification.play();
      notification.pause();
      notification.currentTime = 0;
      audioUnlocked = true;
    }
  },
  { once: true }
);

const renderResult = () => {
  if (!deadLine) {
    timers.classList.add("timers_no_dl");
  } else {
    const data = getTimeRemaining(deadLine);
    timers.classList.remove("timers_no_dl");
    document.querySelector("#timer__total").innerHTML = deadLine;
    document.querySelector("#timer__days").innerHTML = `Days: ${data.days}`;
    document.querySelector("#timer__hours").innerHTML = `Hours: ${data.hours}`;
    document.querySelector("#timer__minutes").innerHTML =
      `Minutes: ${data.minutes}`;
    document.querySelector("#timer__seconds").innerHTML =
      `Seconds: ${data.seconds}`;
    if (data.total <= 0) {
      clearInterval(timer);

      dl_modal.classList.remove("modal_hidden");
      notification.play().catch((err) => {
        console.log("Sound blocked:", err);
      });

      localStorage.removeItem("deadline");
      deadLine = null;
      timers.classList.add("timers_no_dl");

      return;
    }
  }
};

timer = setInterval(renderResult, 1000);

const savedDeadline = localStorage.getItem("deadline");
deadLine = savedDeadline;

let showGallery = document.querySelector("#choose_bg_but");
const gallery = document.querySelector(".gallery_wrap");

showGallery.addEventListener("click", () => {
  gallery.classList.add("gallery_wrap_active");
});

const bg_img = document.querySelectorAll(".bg_img");
const body = document.querySelector("body");

bg_img.forEach((img) => {
  img.addEventListener("click", () => {
    document.body.style.backgroundImage = `url(${img.src})`;
    localStorage.setItem("bg", `url(${img.src})`);
    gallery.classList.remove("gallery_wrap_active");
  });
});

let bg_wallpapers = localStorage.getItem("bg");
if (bg_wallpapers) {
  document.body.style.backgroundImage = bg_wallpapers;
}

const button_clear_dl = document.querySelector("#clear_dl");
button_clear_dl.addEventListener("click", () => {
  localStorage.removeItem("deadline");
  deadLine = null;
  timers.classList.toggle("timers_no_dl");
});

const btn_close = document.querySelector(".btn-close");
const btn_sec_close = document.querySelector(".btn-secondary");

btn_close.addEventListener("click", () => {
  dl_modal.classList.add("modal_hidden");
});

btn_sec_close.addEventListener("click", () => {
  dl_modal.classList.add("modal_hidden");
});
