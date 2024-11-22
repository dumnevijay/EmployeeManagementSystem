// Global variables
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let currentPage = 1;
const itemsPerPage = 5;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    showListing();
    setupEventListeners();
    updateEmployeeList();
});

// Event Listeners Setup
function setupEventListeners() {
    // Form submission
    document.getElementById('employeeForm').addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

// Navigation Functions
function showRegistration() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('registrationPage').classList.add('active');
}

function showListing() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('listingPage').classList.add('active');
    updateEmployeeList();
}

function toggleMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    const employee = {
        id: Date.now(),
        name: document.getElementById('name').value,
        position: document.getElementById('position').value,
        about: document.getElementById('about').value,
        joining_date: document.getElementById('joining_date').value
    };
    
    employees.push(employee);
    saveToLocalStorage();
    e.target.reset();
    showListing();
}

// Employee List Management
function updateEmployeeList() {
    const tableBody = document.getElementById('employeeList');
    const filteredEmployees = getFilteredEmployees();
    const paginatedEmployees = getPaginatedEmployees(filteredEmployees);
    
    tableBody.innerHTML = '';
    
    paginatedEmployees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.about}</td>
            <td>${employee.joining_date}</td>
            <td>
                <button onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    updatePagination(filteredEmployees.length);
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        saveToLocalStorage();
        updateEmployeeList();
    }
}

// Search Functionality
function handleSearch(e) {
    currentPage = 1;
    updateEmployeeList();
}

function getFilteredEmployees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    return employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm)
    );
}

// Pagination
function getPaginatedEmployees(filteredEmployees) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    document.getElementById('currentPage').textContent = 
        `Page ${currentPage} of ${totalPages || 1}`;
    
    // Update button states
    const prevButton = document.querySelector('.pagination button:first-child');
    const nextButton = document.querySelector('.pagination button:last-child');
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalItems === 0;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updateEmployeeList();
    }
}

function nextPage() {
    const totalPages = Math.ceil(getFilteredEmployees().length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateEmployeeList();
    }
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}