document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const itemsLeftSpan = document.getElementById('items-left');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Initialize the app
    function init() {
        renderTodos();
        updateItemsLeft();
    }

    // Render todos based on current filter
    function renderTodos(filter = 'all') {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (filter === 'all') return true;
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = filter === 'all' ? 'No tasks yet!' : 
                                      filter === 'active' ? 'No active tasks!' : 'No completed tasks!';
            emptyMessage.classList.add('empty-message');
            todoList.appendChild(emptyMessage);
            return;
        }

        filteredTodos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            if (todo.completed) todoItem.classList.add('completed');

            todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="edit-btn" data-id="${todo.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${todo.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;

            todoList.appendChild(todoItem);
        });

        // Add event listeners to the new elements
        addEventListeners();
    }

    // Add event listeners to todo items
    function addEventListeners() {
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTodo);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', startEditing);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTodo);
        });
    }

    // Add a new todo
    function addTodo(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        
        if (text === '') {
            alert('Please enter a task');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        todoInput.value = '';
        renderTodos(getCurrentFilter());
        updateItemsLeft();
    }

    // Toggle todo completion status
    function toggleTodo(e) {
        const id = parseInt(e.target.dataset.id);
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos(getCurrentFilter());
        updateItemsLeft();
    }

    // Start editing a todo
    function startEditing(e) {
        const id = parseInt(e.target.closest('.edit-btn').dataset.id);
        const todoItem = e.target.closest('.todo-item');
        const todoText = todoItem.querySelector('.todo-text');
        const currentText = todoText.textContent;

        todoItem.classList.add('editing');
        todoItem.innerHTML = `
            <input type="text" class="todo-edit-input" value="${currentText}">
            <button class="save-btn" data-id="${id}">Save</button>
        `;

        const editInput = todoItem.querySelector('.todo-edit-input');
        editInput.focus();

        todoItem.querySelector('.save-btn').addEventListener('click', saveEdit);
        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit.call(this.nextElementSibling, e);
            }
        });
    }

    // Save edited todo
    function saveEdit(e) {
        const id = parseInt(e.target.dataset.id);
        const newText = e.target.previousElementSibling.value.trim();

        if (newText === '') {
            alert('Task cannot be empty');
            return;
        }

        todos = todos.map(todo => 
            todo.id === id ? { ...todo, text: newText } : todo
        );
        saveTodos();
        renderTodos(getCurrentFilter());
    }

    // Delete a todo
    function deleteTodo(e) {
        const id = parseInt(e.target.closest('.delete-btn').dataset.id);
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos(getCurrentFilter());
        updateItemsLeft();
    }

    // Clear completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos(getCurrentFilter());
        updateItemsLeft();
    }

    // Update items left counter
    function updateItemsLeft() {
        const activeTodos = todos.filter(todo => !todo.completed).length;
        itemsLeftSpan.textContent = `${activeTodos} ${activeTodos === 1 ? 'item' : 'items'} left`;
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Get current filter
    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }

    // Filter todos
    function filterTodos(e) {
        const filter = e.target.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTodos(filter);
    }

    // Event listeners
    todoForm.addEventListener('submit', addTodo);
    filterButtons.forEach(btn => btn.addEventListener('click', filterTodos));
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Initialize the app
    init();
});