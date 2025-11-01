// Store completed steps for each role separately
let completedSteps = {
    technical: new Set(),
    comms: new Set(),
    graphics: new Set()
};

const totalSteps = {
    technical: 19,
    comms: 9,
    graphics: 9
};

// Load saved progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('lmocBroadcastProgress');
    if (saved) {
        const data = JSON.parse(saved);
        completedSteps = {
            technical: new Set(data.technical || []),
            comms: new Set(data.comms || []),
            graphics: new Set(data.graphics || [])
        };

        // Apply completed status to all steps
        Object.keys(completedSteps).forEach(role => {
            completedSteps[role].forEach(stepNum => {
                const step = document.querySelector(`[data-role="${role}"][data-step="${stepNum}"]`);
                if (step) step.classList.add('completed');
            });
            updateProgress(role);
        });
    }
}

// Save progress to localStorage
function saveProgress() {
    const data = {
        technical: [...completedSteps.technical],
        comms: [...completedSteps.comms],
        graphics: [...completedSteps.graphics]
    };
    localStorage.setItem('lmocBroadcastProgress', JSON.stringify(data));
}

// Add click handlers to all steps
document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('click', function() {
        const role = this.dataset.role;
        const stepNum = parseInt(this.dataset.step);

        if (this.classList.contains('completed')) {
            this.classList.remove('completed');
            completedSteps[role].delete(stepNum);
        } else {
            this.classList.add('completed');
            completedSteps[role].add(stepNum);
        }

        updateProgress(role);
        saveProgress();
    });
});

function updateProgress(role) {
    const percentage = Math.round((completedSteps[role].size / totalSteps[role]) * 100);
    const progressFill = document.getElementById(`progressFill-${role}`);
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.textContent = percentage + '% Complete';
    }
}

function resetWorkflow(role) {
    if (confirm(`Are you sure you want to reset the ${role === 'technical' ? 'Technical Director' : role === 'comms' ? 'Comms/Backup Director' : 'Graphics Host'} workflow?`)) {
        // Clear all completed step visuals for this role
        document.querySelectorAll(`[data-role="${role}"]`).forEach(step => {
            step.classList.remove('completed');
        });

        // Clear the completedSteps for this role
        completedSteps[role].clear();

        // Update progress bar to 0%
        updateProgress(role);

        // Save to localStorage
        saveProgress();
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Load progress on page load
loadProgress();
