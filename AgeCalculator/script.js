document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    calculateBtn.addEventListener('click', function() {
        // Hide previous results/errors
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';

        // Get input values
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);

        // Validate inputs
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            showError("Please enter valid numbers for all fields.");
            return;
        }

        // Basic validation
        if (day < 1 || day > 31) {
            showError("Day must be between 1 and 31.");
            return;
        }

        if (month < 1 || month > 12) {
            showError("Month must be between 1 and 12.");
            return;
        }

        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
            showError(`Year must be between 1900 and ${currentYear}.`);
            return;
        }

        // Validate the date (e.g., February 30th doesn't exist)
        const inputDate = new Date(year, month - 1, day);
        if (inputDate.getDate() !== day || 
            inputDate.getMonth() !== month - 1 || 
            inputDate.getFullYear() !== year) {
            showError("Invalid date. Please check your inputs.");
            return;
        }

        // Check if date is in the future
        const today = new Date();
        if (inputDate > today) {
            showError("Birth date cannot be in the future.");
            return;
        }

        // Calculate age
        calculateAge(inputDate);
    });

    function calculateAge(birthDate) {
        const today = new Date();
        
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Adjust for negative months or days
        if (days < 0) {
            months--;
            // Get the last day of the previous month
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Display the result
        resultDiv.innerHTML = `
            <p>Your age is:</p>
            <p><strong>${years}</strong> years, <strong>${months}</strong> months, and <strong>${days}</strong> days</p>
        `;
        resultDiv.style.display = 'block';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
});