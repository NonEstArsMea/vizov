document.addEventListener("DOMContentLoaded", () => {
    const calendarEl = document.getElementById("calendar");

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const events = {
        "2025-10-05": ["🔥 Тимбилдинг в Москве"],
        "2025-10-12": ["🏆 Корпоративные игры"],
        "2025-10-21": ["🎉 Турнир по спасению"],
    };

    function renderCalendar(month, year) {
        calendarEl.innerHTML = "";

        // заголовок
        const header = document.createElement("div");
        header.className = "calendar-header";
        header.innerHTML = `
      <button onclick="changeMonth(-1)">←</button>
      <h2>${new Date(year, month).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}</h2>
      <button onclick="changeMonth(1)">→</button>
    `;
        calendarEl.appendChild(header);

        const grid = document.createElement("div");
        grid.className = "calendar-grid";

        const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        weekDays.forEach(d => {
            const el = document.createElement("div");
            el.className = "day-name";
            el.textContent = d;
            grid.appendChild(el);
        });

        const firstDay = new Date(year, month).getDay();
        const startDay = (firstDay + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // пустые клетки
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "day inactive";
            grid.appendChild(emptyCell);
        }

        // дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const cell = document.createElement("div");
            cell.className = "day active";

            const dayOfWeek = (startDay + day - 1) % 7;
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                cell.classList.add("weekend");
            }

            const dayNumber = document.createElement("div");
            dayNumber.className = "day-number";
            dayNumber.textContent = day;
            cell.appendChild(dayNumber);

            if (events[dateKey]) {
                events[dateKey].forEach(event => {
                    const ev = document.createElement("div");
                    ev.className = "event";
                    ev.textContent = event;
                    cell.appendChild(ev);
                });
            }

            grid.appendChild(cell);
        }

        calendarEl.appendChild(grid);

        // запускаем анимацию
        setTimeout(() => {
            grid.classList.add("active");
        }, 50);
    }

    window.changeMonth = function (delta) {
        currentMonth += delta;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    };

    renderCalendar(currentMonth, currentYear);
});
