
window.addEventListener('load', function() {
    const habitInput = document.getElementById('habitInput');
    const addHabitBtn = document.getElementById('addHabit');
    const habitList = document.getElementById('habitList');
    
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    
    // Load habits
    habits.forEach(habit => renderHabit(habit));
    
    // Add habit - FIXED
    addHabitBtn.onclick = function() {
        const name = habitInput.value.trim();
        if (name) {
            const habit = { name, completions: {} };
            habits.push(habit);
            localStorage.setItem('habits', JSON.stringify(habits));
            renderHabit(habit);
            habitInput.value = '';
        }
    };
    
    // Render habit
    function renderHabit(habit) {
        const div = document.createElement('div');
        div.className = 'habit-item';
        div.innerHTML = `
            <span class="habit-name">${habit.name}</span>
            <button class="delete-btn" onclick="deleteHabit('${habit.name}')">Delete</button>
        `;
        habitList.appendChild(div);
    }
    
    // Delete habit
    window.deleteHabit = function(name) {
        let habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits = habits.filter(h => h.name !== name);
        localStorage.setItem('habits', JSON.stringify(habits));
        location.reload();
    };
});