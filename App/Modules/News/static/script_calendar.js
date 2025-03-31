let calendarElement;
let infoContainer;
let selectedDateElement;
let namedaysElement;
let holidaysElement;
let monthYearElement;
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
const months = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

function updateMonthYear() {
  if (monthYearElement) {
    monthYearElement.textContent = `${months[currentMonth - 1]} ${currentYear}`;
  }
}

function createCalendar(month, year) {
  if (!calendarElement) return;
  calendarElement.innerHTML = ""; // Czyścimy kalendarz

  const daysInMonth = new Date(year, month, 0).getDate();
  let firstDayIndex = new Date(year, month - 1, 1).getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Przesuwamy indeks dni, aby poniedziałek był pierwszy
  const today = new Date();

  const daysOfWeek = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
  daysOfWeek.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day", "day-of-week");
    dayElement.textContent = day;
    calendarElement.appendChild(dayElement);
  });

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyElement = document.createElement("div");
    calendarElement.appendChild(emptyElement);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.textContent = day;

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() + 1 &&
      year === today.getFullYear();
    const dayOfWeek =
      new Date(year, month - 1, day).getDay() === 0
        ? 6
        : new Date(year, month - 1, day).getDay() - 1; // Przesuwamy indeks dni, aby poniedziałek był pierwszy

    if (isToday) {
      dayElement.classList.add("today");
    } else if (dayOfWeek === 5) {
      // Sobota = 5
      dayElement.classList.add("saturday");
    } else if (dayOfWeek === 6) {
      // Niedziela = 6
      dayElement.classList.add("sunday");
    } else {
      dayElement.classList.add("workday");
    }

    dayElement.addEventListener("click", function () {
      //http://127.0.0.1:8000           do działania gdy pobierzemy pliki na komputer
      //https://ioprojekt.onrender.com      do działania na serwerze 
      fetch(`https://ioprojekt.onrender.com/news/api/data?day=${day}&month=${month}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          selectedDateElement.textContent = `${day}-${month}-${year}`;
          namedaysElement.textContent = data.namedays;
          holidaysElement.textContent = data.holidays;
        })
        .catch((error) => console.error("Fetch error:", error));
    });

    dayElement.addEventListener("mouseenter", function () {
      dayElement.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
    });

    dayElement.addEventListener("mouseleave", function () {
      dayElement.style.boxShadow = "none";
    });

    calendarElement.appendChild(dayElement);
  }
  updateMonthYear();
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear -= 1;
  } else if (currentMonth > 12) {
    currentMonth = 1;
    currentYear += 1;
  }
  createCalendar(currentMonth, currentYear);
}

document.addEventListener("DOMContentLoaded", function () {
  calendarElement = document.getElementById("calendar");
  infoContainer = document.getElementById("info-container");
  selectedDateElement = document.getElementById("selected-date");
  namedaysElement = document.getElementById("namedays");
  holidaysElement = document.getElementById("holidays");
  monthYearElement = document.getElementById("month-year");

  document.getElementById("prev-month").addEventListener("click", function () {
    changeMonth(-1);
  });

  document.getElementById("next-month").addEventListener("click", function () {
    changeMonth(1);
  });

  createCalendar(currentMonth, currentYear);
});

////kod potrzeby do testów Jest: script_calendar.test.js
// module.exports = {
//     createCalendar,
//     changeMonth,
//     updateMonthYear,
//     setElements: (elements) => {
//         calendarElement = elements.calendarElement;
//         monthYearElement = elements.monthYearElement;
//         selectedDateElement = elements.selectedDateElement;
//         namedaysElement = elements.namedaysElement;
//         holidaysElement = elements.holidaysElement;
//         infoContainer = elements.infoContainer;
//     }
// };
