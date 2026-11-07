
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const counter = document.getElementById('counter');
const progressFill = document.getElementById('progress-fill');
const percentageLabel = document.getElementById('percentage-label');

// GIF REFERENCES

const zeroGif = document.getElementById('zero-gif');
const twentyFiveGif = document.getElementById('twentyfive-gif');
const fiftyGif = document.getElementById('fifty-gif');
const seventyFiveGif = document.getElementById('seventyfive-gif');
const hundredGif = document.getElementById('hundred-gif');

// LOCAL STORAGE

function saveTasks() {
  const allTasks = document.querySelectorAll('.task-item');

  const tasks = Array.from(allTasks).map(item => ({
    text: item.querySelector('.task-text').textContent,
    completed: item.querySelector('input[type="checkbox"]').checked
  }));

  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// CREATE TASK

function createTask(taskText, completed = false) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const taskLeft = document.createElement('div');
  taskLeft.className = 'task-left';

  const label = document.createElement('label');
  label.className = 'checkbox-container';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;

  const checkmark = document.createElement('span');
  checkmark.className = 'checkmark';

  label.appendChild(checkbox);
  label.appendChild(checkmark);

  const taskSpan = document.createElement('span');
  taskSpan.className = 'task-text';
  taskSpan.textContent = taskText;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.setAttribute('aria-label', 'Delete task');

  taskLeft.appendChild(label);
  taskLeft.appendChild(taskSpan);

  li.appendChild(taskLeft);
  li.appendChild(deleteBtn);

  if (completed) {
    li.classList.add('completed');
  }

  taskList.appendChild(li);
}

// LOAD TASKS

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('myTasks')) || [];

  savedTasks.forEach(task => {
    createTask(task.text, task.completed);
  });
}

// CONFETTI

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

// UPDATE COUNTER AND PROGRESS

function updateCounter() {
  const allTasks = document.querySelectorAll('.task-item');

  const activeTasks = Array.from(allTasks).filter(item => {
    return !item.querySelector('input[type="checkbox"]').checked;
  });

  counter.textContent = `Your remaining todos : ${activeTasks.length}`;

  let percentage = 0;

  if (allTasks.length > 0) {
    const completedCount = allTasks.length - activeTasks.length;
    const rawPercentage = (completedCount / allTasks.length) * 100;

    const steps = [0, 25, 50, 75, 100];

    percentage = steps.reduce((prev, curr) =>
      Math.abs(curr - rawPercentage) < Math.abs(prev - rawPercentage)
        ? curr
        : prev
    );
  }

  progressFill.style.width = `${percentage}%`;
  percentageLabel.textContent = `${percentage}%`;

  [zeroGif, twentyFiveGif, fiftyGif, seventyFiveGif, hundredGif]
    .forEach(gif => gif.style.display = 'none');

  if (allTasks.length > 0) {
    if (percentage === 0) {
      zeroGif.style.display = 'block';
    } else if (percentage === 25) {
      twentyFiveGif.style.display = 'block';
    } else if (percentage === 50) {
      fiftyGif.style.display = 'block';
    } else if (percentage === 75) {
      seventyFiveGif.style.display = 'block';
    } else if (percentage === 100) {
      hundredGif.style.display = 'block';
    }
  }

  if (allTasks.length > 0 && activeTasks.length === 0) {
    triggerConfetti();
  }
}

// ADD TASK

function addTask() {
  const taskText = todoInput.value.trim();

  if (taskText === '') return;

  createTask(taskText);

  todoInput.value = '';

  saveTasks();
  updateCounter();
}

// CHECKBOX EVENT

taskList.addEventListener('change', function(e) {
  if (e.target.matches('input[type="checkbox"]')) {
    const taskItem = e.target.closest('.task-item');

    if (e.target.checked) {
      taskItem.classList.add('completed');
    } else {
      taskItem.classList.remove('completed');
    }

    saveTasks();
    updateCounter();
  }
});

// DELETE TASK

taskList.addEventListener('click', function(e) {
  if (e.target.matches('.delete-btn')) {
    const taskItem = e.target.closest('.task-item');

    taskItem.remove();

    saveTasks();
    updateCounter();
  }
});

// EVENT LISTENERS

addBtn.addEventListener('click', addTask);

todoInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// ===================================
// POMODORO TIMER
// ===================================

const timerToggle = document.getElementById('timer-toggle');
const timerPanel = document.getElementById('timer-panel');
const timerDisplay = document.getElementById('timer-display');

const timerStart = document.getElementById('timer-start');
const timerPause = document.getElementById('timer-pause');
const timerStop = document.getElementById('timer-stop');

const timerStatus = document.getElementById('timer-status');

// TIMER SETTINGS

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timeLeft = FOCUS_TIME;
let timerInterval = null;
let isRunning = false;
let isBreak = false;

// UPDATE DISPLAY

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// OPEN / CLOSE TIMER

timerToggle.addEventListener('click', function() {
  timerPanel.classList.toggle('active');
});

// START TIMER

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timerStatus.textContent = isBreak
    ? 'Break time! Relax.'
    : 'Stay focused!';

  timerInterval = setInterval(function() {
    timeLeft--;

    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;

      if (!isBreak) {
        alert('Focus session completed! Time for a 5-minute break.');

        isBreak = true;
        timeLeft = BREAK_TIME;

        timerStatus.textContent = 'Break time! Ready?';

      } else {
        alert('Break completed! Back to focus.');

        isBreak = false;
        timeLeft = FOCUS_TIME;

        timerStatus.textContent = 'Ready for another focus session?';
      }

      updateTimerDisplay();
    }

  }, 1000);
}

// PAUSE TIMER

function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timerInterval);

  timerInterval = null;
  isRunning = false;

  timerStatus.textContent = 'Timer paused.';
}

// STOP AND RESET TIMER

function stopTimer() {
  clearInterval(timerInterval);

  timerInterval = null;

  isRunning = false;
  isBreak = false;
  timeLeft = FOCUS_TIME;

  updateTimerDisplay();

  timerStatus.textContent = 'Timer reset. Ready to focus?';
}

// TIMER BUTTON EVENTS

timerStart.addEventListener('click', startTimer);
timerPause.addEventListener('click', pauseTimer);
timerStop.addEventListener('click', stopTimer);

// STARTUP

loadTasks();
updateCounter();
updateTimerDisplay();
