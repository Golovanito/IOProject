const {
  createCalendar,
  changeMonth,
  updateMonthYear,
  setElements,
} = require("../static/script_calendar");

// Mockowanie fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        namedays: "Imieniny Testowe",
        holidays: "Święto Testowe",
      }),
  }),
);

// Mockowanie DOM elementów
document.body.innerHTML = `
  <div id="calendar"></div>
  <div id="month-year"></div>
  <div id="selected-date"></div>
  <div id="namedays"></div>
  <div id="holidays"></div>
  <div id="info-container"></div>
  <button id="prev-month"></button>
  <button id="next-month"></button>
`;

const elements = {
  calendarElement: document.getElementById("calendar"),
  monthYearElement: document.getElementById("month-year"),
  selectedDateElement: document.getElementById("selected-date"),
  namedaysElement: document.getElementById("namedays"),
  holidaysElement: document.getElementById("holidays"),
  infoContainer: document.getElementById("info-container"),
};

setElements(elements);

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

describe("createCalendar", () => {
  test("powinien utworzyć kalendarz dla danego miesiąca i roku", () => {
    createCalendar(5, 2023);
    expect(elements.calendarElement.innerHTML).toContain("1");
    expect(elements.calendarElement.innerHTML).toContain("31");
  });

  test("powinien wyróżnić dzisiejszą datę", () => {
    const today = new Date();
    createCalendar(today.getMonth() + 1, today.getFullYear());
    const todayElement = document.querySelector(".today");
    expect(todayElement).not.toBeNull();
  });
});

describe("changeMonth", () => {
  test("powinien zmienić na następny miesiąc", () => {
    const initialMonth = 1; // Styczeń
    const initialYear = 2025;
    createCalendar(initialMonth, initialYear);
    changeMonth(1);
    const expectedMonth = "Luty";
    const expectedYear = 2025;
    expect(elements.monthYearElement.textContent).toBe(
      `${expectedMonth} ${expectedYear}`,
    );
  });

  test("powinien zmienić na poprzedni miesiąc", () => {
    const initialMonth = 2; // Luty
    const initialYear = 2025;
    createCalendar(initialMonth, initialYear);
    changeMonth(-1);
    const expectedMonth = "Styczeń";
    const expectedYear = 2025;
    expect(elements.monthYearElement.textContent).toBe(
      `${expectedMonth} ${expectedYear}`,
    );
  });
});

describe("updateMonthYear", () => {
  test("powinien wyświetlać poprawny miesiąc i rok", () => {
    currentMonth = 1; //// Styczeń
    currentYear = 2025;
    updateMonthYear();
    expect(elements.monthYearElement.textContent).toBe("Styczeń 2025"); ////
  });
});

describe("integracyjne testy", () => {
  const today = new Date();
  const month = today.getMonth() + 1; // Aktualny miesiąc
  const year = today.getFullYear(); // Aktualny rok

  test("powinien zmienić miesiąc i zaktualizować kalendarz", () => {
    currentMonth = 1; //// Styczeń
    currentYear = 2025; ////
    createCalendar(currentMonth, currentYear);
    changeMonth(1);
    const expectedMonth = "Luty";
    const expectedYear = 2025;
    expect(elements.monthYearElement.textContent).toBe(
      `${expectedMonth} ${expectedYear}`,
    );
  });
});
