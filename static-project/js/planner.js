/**
 * COS 106 Course Task Scheduler - Pure Vanilla JS State Engine
 * Manages, tracks, and renders task objects dynamically.
 */

// 1. Core JavaScript Array to store task objects
let taskArray = [
    { id: "s1", title: "Review Lect 4 Binary Search Trees", category: "Academic", priority: "High", completed: false, dueDate: "2026-06-28" },
    { id: "s2", title: "Complete HTML/CSS Layout for COS 106", category: "Lab Project", priority: "High", completed: true, dueDate: "2026-06-26" },
    { id: "s3", title: "Prepare Questions for Math Tutorial", category: "Exam Prep", priority: "Medium", completed: false, dueDate: "2026-06-30" }
];

// DOM Element Selectors
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListContainer = document.getElementById('task-list');
const totalCountBadge = document.getElementById('total-count');

// 2. Initialize application after DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    renderTaskBoard();
});

// Event Listener for Add Task Button
if (addTaskBtn) {
    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskFromInput();
    });
}

// 3. Adding a task from the inputs
function addTaskFromInput() {
    const title = taskInput.value.trim();
    const category = taskCategory.value;
    const priority = taskPriority.value;

    if (!title) {
        alert("Please specify a valid activity detail block!");
        return;
    }

    // Generate basic due date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Create new task object
    const newTask = {
        id: "task_" + Date.now(),
        title: title,
        category: category,
        priority: priority,
        completed: false,
        dueDate: formattedDate
    };

    // Push into core array
    taskArray.push(newTask);
    
    // Clear input
    taskInput.value = '';

    // Render updated state
    renderTaskBoard();
}

// 4. Rendering/updating the DOM dynamically from the array
function renderTaskBoard() {
    if (!taskListContainer) return;

    // Reset list contents
    taskListContainer.innerHTML = '';

    // Update statistics
    if (totalCountBadge) {
        totalCountBadge.textContent = taskArray.length;
    }

    if (taskArray.length === 0) {
        taskListContainer.innerHTML = `
            <li class="task-empty">
                <p>All schedulers completed or cleared. Add some above!</p>
            </li>
        `;
        return;
    }

    // Render each item dynamically
    taskArray.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <div class="task-item-left">
                <div class="task-checkbox" onclick="toggleTaskCompletion('${task.id}')"></div>
                <div>
                    <p class="task-title-text">${escapeHTML(task.title)}</p>
                    <div class="task-meta-row">
                        <span class="task-cat-badge">${task.category}</span>
                        <span class="task-priority-badge priority-${task.priority}">${task.priority} Priority</span>
                        <span>Due: ${task.dueDate}</span>
                    </div>
                </div>
            </div>
            <button class="task-delete-btn" onclick="deleteTaskFromBoard('${task.id}')" title="Delete Task">🗑</button>
        `;

        taskListContainer.appendChild(li);
    });
}

// 5. Toggling tasks as "completed" (applies line-through change)
window.toggleTaskCompletion = function(id) {
    taskArray = taskArray.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTaskBoard();
};

// 6. Completely deleting a task from the array and DOM
window.deleteTaskFromBoard = function(id) {
    taskArray = taskArray.filter(task => task.id !== id);
    renderTaskBoard();
};

// Helper function to escape HTML strings to prevent injection
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
