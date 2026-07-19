const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const counter = document.getElementById('counter');
const progressFill = document.getElementById('progress-fill');
const percentageLabel = document.getElementById('percentage-label');

// GIF element references
const zeroGif = document.getElementById('zero-gif');
const twentyFiveGif = document.getElementById('twentyfive-gif');
const fiftyGif = document.getElementById('fifty-gif');
const seventyFiveGif = document.getElementById('seventyfive-gif');
const hundredGif = document.getElementById('hundred-gif');

function triggerConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}

function updateCounter() {
  const allTasks = document.querySelectorAll('.task-item');
  const activeTasks = Array.from(allTasks).filter(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    return !checkbox.checked;
  });
  
  counter.textContent = `Your remaining todos : ${activeTasks.length}`;

  // Progress Snap Calculation Logic
  let percentage = 0;
  if (allTasks.length > 0) {
    const completedCount = allTasks.length - activeTasks.length;
    const rawPercentage = (completedCount / allTasks.length) * 100;
    
    // Snap raw percentage to the nearest milestone bracket [0, 25, 50, 75, 100]
    const steps = [0, 25, 50, 75, 100];
    percentage = steps.reduce((prev, curr) => 
      Math.abs(curr - rawPercentage) < Math.abs(prev - rawPercentage) ? curr : prev
    );
  }
  
  // Update UI Bar and Label text
  progressFill.style.width = `${percentage}%`;
  percentageLabel.textContent = `${percentage}%`;

  // Reset visibility states for conditional elements
  zeroGif.style.display = 'none';
  twentyFiveGif.style.display = 'none';
  fiftyGif.style.display = 'none';
  seventyFiveGif.style.display = 'none';
  hundredGif.style.display = 'none';

  // Show specific GIF variants depending on snapped completion percent match
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

  // Trigger confetti on full list completion
  if (allTasks.length > 0 && activeTasks.length === 0) {
    triggerConfetti();
  }
}

function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');
  li.className = 'task-item';
  li.innerHTML = `
    <div class="task-left">
      <label class="checkbox-container">
        <input type="checkbox">
        <span class="checkmark"></span>
      </label>
      <span class="task-text">${taskText}</span>
    </div>
    <button class="delete-btn">×</button>
  `;

  taskList.appendChild(li);
  todoInput.value = '';
  updateCounter();
}

// Event Delegation for handling dynamic runtime elements cleanly
taskList.addEventListener('change', function(e) {
  if (e.target.matches('input[type="checkbox"]')) {
    const taskItem = e.target.closest('.task-item');
    if (e.target.checked) {
      taskItem.classList.add('completed');
    } else {
      taskItem.classList.remove('completed');
    }
    updateCounter();
  }
});

taskList.addEventListener('click', function(e) {
  if (e.target.matches('.delete-btn')) {
    const taskItem = e.target.closest('.task-item');
    taskItem.remove();
    updateCounter();
  }
});

addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Run visual counter setup on startup load
updateCounter();
