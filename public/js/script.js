// FORM ANIMATION

const labels = document.querySelectorAll('.form-control label')
const button = document.getElementById('button')

labels.forEach(label => {
    label.innerHTML = label.innerText
        .split('') 
        .map((letter, idx) => `<span style ="transition-delay:${idx * 1}ms">${letter}</span>`)
        .join('')
})

// CLOCK SECTION

const hourEl = document.querySelector('.hour')
const minuteEl = document.querySelector('.minute')
const secondEl = document.querySelector('.second')
const timeEl = document.querySelector('.time')
const dateEl = document.querySelector('.date')

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function setTime() {
    const time = new Date();
    const month = time.getMonth()
    const day = time.getDay()
    const date = time.getDate()
    const hours = time.getHours()
    const hoursForClock = hours % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    const amPm = hours >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? `0${minutes}` : minutes} ${amPm}`

    dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`
}

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

setTime()

setInterval(setTime, 1000)

// SHOW PASSWORD

function myFunction() {
    const x = document.getElementById("password");
    const y = document.getElementById("togglePassword")
    const closed = 'fa-eye-slash'
    if (x.type === "password") {
      x.type = "text";
      y.classList.add(closed)
    } else {
      x.type = "password";
      y.classList.remove(closed)
    }
  }





