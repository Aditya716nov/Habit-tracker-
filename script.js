document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habitInput');
    const addHabitBtn = document.getElementById('addHabit');
    const habitList = document.getElementById('habitList');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const weekView = document.getElementById('weekView');
    const monthView = document.getElementById('monthView');

    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    // Load habits
    habits.forEach(habit => renderHabit(habit));
    updateProgress();

    // Add habit
    addHabitBtn.addEventListener('click', () => {
        const name = habitInput.value.trim();
        if (name) {
            const habit = { name, completions: {} };
            habits.push(habit);
            saveHabits();
            renderHabit(habit);
            habitInput.value = '';
            updateProgress();
        }
    });

    // Delete habit
    function deleteHabit(name) {
        habits = habits.filter(h => h.name !== name);
        saveHabits();
        habitList.innerHTML = '';
        habits.forEach(habit => renderHabit(habit));
        updateProgress();
    }

    // Render habit with calendar checkboxes
    function renderHabit(habit) {
        const div = document.createElement('div');
        div.className = 'habit-item';
        div.innerHTML = `
            <span class="habit-name">${habit.name}</span>
            <div class="calendar" id="cal-${habit.name.replace(/s+/g, '-')}"></div>
            <button class="delete-btn" onclick="deleteHabit('${habit.name}')">Delete</button>
        `;
        habitList.appendChild(div);
        renderCalendar(habit);
    }

    // Render 7-day week + monthly grid
    function renderCalendar(habit) {
        const cal = document.getElementById(`cal-${habit.name.replace(/s+/g, '-')}`);
        const now = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) { // Last 7 days
            const day = new Date(now.getTime() - i * 86400000);
            days.push(day.toISOString().split('T')[0]);
        }
        cal.innerHTML = days.map(day => {
            const isToday = day === now.toISOString().split('T')[0];
            const completed = habit.completions[day] || false;
            return `<div class="day ${completed ? 'complete' : ''} ${isToday ? 'today' : ''}" 
                    onclick="toggleCompletion('${habit.name}', '${day}')">${day.split('-')[2]}</div>`;
        }).join('');
    }

    // Toggle completion
    window.toggleCompletion = (name, date) => {
        const habit = habits.find(h => h.name === name);
        habit.completions[date] = !habit.completions[date];
        saveHabits();
        updateProgress();
        renderCalendar(habit); // Re-render calendar
    };

    // Save to localStorage
    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    // Update progress views
    function updateProgress() {
        const now = new Date();
        // Week: last 7 days
        const weekDays = [];
        for (let i = 6; i >= 0; i--) {
            const day = new Date(now.getTime() - i * 86400000).toISOString().split('T')[0];
            weekDays.push(day);
        }
        let weekTotal = 0, weekComplete = 0;
        habits.forEach(habit => {
            weekDays.forEach(day => {
                if (habit.completions[day]) weekComplete++;
                weekTotal++;
            });
        });
        weekView.innerHTML = `
            <div class="progress-stats">
                <h3>Weekly Progress</h3>
                <p>${Math.round((weekComplete / weekTotal) * 100) || 0}% complete (${weekComplete}/${weekTotal})</p>
                <div class="calendar">${weekDays.map(day => `<div class="day">${day.split('-')[2]}</div>`).join('')}</div>
            </div>
        `;

        // Month: days in current month
        const monthDays = [];
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
            monthDays.push(new Date(d).toISOString().split('T')[0]);
        }
        let monthTotal = 0, monthComplete = 0;
        habits.forEach(habit => {
            monthDays.forEach(day => {
                if (habit.completions[day]) monthComplete++;
                monthTotal++;
            });
        });
        monthView.innerHTML = `
            <div class="progress-stats">
                <h3>Monthly Progress</h3>
                <p>${Math.round((monthComplete / monthTotal) * 100) || 0}% complete (${monthComplete}/${monthTotal})</p>
                <div class="calendar">${monthDays.map(day => `<div class="day">${day.getDate()}</div>`).join('')}</div>
            </div>
        `;
    }

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.progress-view').forEach(v => v.classList.add('hidden'));
            document.getElementById(btn.dataset.tab + 'View').classList.remove('hidden');
        });
    });
});