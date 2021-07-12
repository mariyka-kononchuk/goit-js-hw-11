
//переводит мс в формат день:час:мин:сек
function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = pad(Math.floor(ms / day));
    // Remaining hours
    const hours = pad(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = pad(Math.floor(((ms % day) % hour) / minute));
    // Remaining seconds
    const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

    return { days, hours, minutes, seconds };
}

//добавляет нолик в формат даты 00:00:00:00 вместо 0:0:0:0
function pad(value) {
    return String(value).padStart(2, '0');
};


const refs = {
    startBtn: document.querySelector('button[data-start]'),
    inputData: document.getElementById("date-selector"),
    timerDays: document.querySelector('span[data-days]'),
    timerHours: document.querySelector('span[data-hours]'),
    timerMinutes: document.querySelector('span[data-minutes]'),
    timerSeconds: document.querySelector('span[data-seconds]'),
}

refs.inputData.addEventListener("change", onDataInput);
refs.startBtn.addEventListener('click', () => {
    if (finishTime <= Date.now()) {
        Swal.fire({
            icon: 'warning',
            title: 'Please choose a date in the future',
        })
        return;
    }
    timer.start();
});

let finishTime = 0;
function onDataInput() {
    const input = this.value;
    const dateEntered = new Date(input);
    finishTime = dateEntered.getTime();
    // console.log(dateEntered.getTime());
    // console.log(Date.now());
    // console.log(input); //e.g. 2015-11-13
    // console.log(finishTime); //e.g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)
    // console.log(convertMs(finishTime));
    // console.log(convertMs(Date.now()));
};

class Timer {
    constructor({ onTick }) {
        this.intervalId = null;
        this.isActive = false;
        this.onTick = onTick;
    }

    start() {
        if (this.isActive) { //проверяет если таймер уже активен, то не дает его запустить снова
            return;
        }

        refs.startBtn.disabled = true; //если таймер запускается -кнопка запуска становится неактивной
        this.intervalId = setInterval(() => {  //intervalId необходим чтоб остановить таймер(обратиться к нему)
            const currentTime = Date.now();
            //console.log(currentTime);
            // console.log(finishTime);
            const deltaTime = finishTime - currentTime - 10800000;
            //console.log(deltaTime);
            // const { days, hours, minutes, seconds } = convertMs(deltaTime);
            const time = convertMs(deltaTime); //конвертирует мс в правильный формат даты
            //console.log(time);
            if (deltaTime === null) {
                stop()
            };
            this.onTick(time); //передает структурирован параметры даты 

        }, 1000);
    }

    stop() {
        clearInterval(this.intervalId);
        this.isActive = false;
        startBtn.disabled = false;
    }
}

const timer = new Timer({
    onTick: updateClockFace
});

//добавляет время таймера в интерфейс (HTML)
function updateClockFace({ days, hours, minutes, seconds }) {
    refs.timerDays.textContent = `${days}`;
    refs.timerHours.textContent = `${hours}`;
    refs.timerMinutes.textContent = `${minutes}`;
    refs.timerSeconds.textContent = `${seconds}`;
};
