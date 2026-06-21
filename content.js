// Prevent duplicate injection
if (!document.getElementById("dsa-mentor-box")) {
    const mentorbox = document.createElement("div");
    mentorbox.id = "dsa-mentor-box";

    mentorbox.innerHTML = `
        <div class="mentor-header">
            <h3>DSA Mentor</h3>
        </div>
        <p id="problem-title-display">
            <strong>Problem: </strong> <span id="prob-title">Loading...</span> 
            <button id="bookmark-btn" title="Bookmark this problem">☆</button>
        </p>
        
        <div class="tabs">
            <button class="tab-btn active" data-target="hints-panel">Hints</button>
            <button class="tab-btn" data-target="notes-panel">Notes</button>
            <button class="tab-btn" data-target="dashboard-panel">Dash</button>
        </div>

        <div id="hints-panel" class="panel active">
            <div id="complexity-box">
                <strong>Target Complexity:</strong><br>
                Time &rarr; <span id="time-comp">?</span><br>
                Space &rarr; <span id="space-comp">?</span>
            </div>
            <p id="hint-text">Click next hint to begin.</p>
            <button id="next-hint-btn">Next Hint</button>
        </div>

        <div id="notes-panel" class="panel" style="display: none;">
            <textarea id="personal-notes" placeholder="Use HashMap...&#10;Check edge cases..."></textarea>
            <div>
                <button id="save-notes-btn">Save Notes</button>
                <span id="save-status"></span>
            </div>
        </div>

        <div id="dashboard-panel" class="panel" style="display: none;">
            <div class="dash-stat">Problems Tracked: <strong id="stat-tracked">0</strong></div>
            <div class="dash-stat">Bookmarked: <strong id="stat-bookmarked">0</strong></div>
            <div class="dash-stat">Notes Added: <strong id="stat-notes">0</strong></div>
        </div>
    `;

    document.body.appendChild(mentorbox);
}

// Data management with localStorage
function getDSAData() {
    const data = localStorage.getItem('dsa_mentor_data');
    return data ? JSON.parse(data) : {};
}

function saveDSAData(data) {
    localStorage.setItem('dsa_mentor_data', JSON.stringify(data));
}

function getProblemData(title) {
    if (!title) return null;
    const data = getDSAData();
    if (!data[title]) {
        data[title] = { bookmarked: false, notes: "", tracked: true };
        saveDSAData(data);
    }
    return data[title];
}

function updateProblemData(title, updates) {
    if (!title) return;
    const data = getDSAData();
    if (!data[title]) {
        data[title] = { bookmarked: false, notes: "", tracked: true };
    }
    data[title] = { ...data[title], ...updates };
    saveDSAData(data);
    updateDashboard();
}

function updateDashboard() {
    const data = getDSAData();
    let tracked = 0;
    let bookmarked = 0;
    let notesCount = 0;

    for (const key in data) {
        tracked++;
        if (data[key].bookmarked) bookmarked++;
        if (data[key].notes && data[key].notes.trim().length > 0) notesCount++;
    }

    const statTracked = document.getElementById("stat-tracked");
    const statBookmarked = document.getElementById("stat-bookmarked");
    const statNotes = document.getElementById("stat-notes");

    if (statTracked) statTracked.textContent = tracked;
    if (statBookmarked) statBookmarked.textContent = bookmarked;
    if (statNotes) statNotes.textContent = notesCount;
}

const hintDataBase = {
    "Two Sum": {
        hints: [
            "Think about using a HashMap to store visited numbers.",
            "For each element, check if target - current exists.",
            "Time complexity can be O(n)."
        ],
        time: "O(n)",
        space: "O(n)"
    },
    "Valid Parentheses": {
        hints: [
            "This problem involves matching opening and closing brackets.",
            "Consider using a stack data structure",
            "Push opening brackets, pop when closing bracket appears."
        ],
        time: "O(n)",
        space: "O(n)"
    },
    "Binary Tree Level Order Traversal": {
        hints: [
            "This is a classic BFS problem.",
            "Use a queue to traverse level-by-level",
            "Track nodes per level using loop size."
        ],
        time: "O(n)",
        space: "O(n)"
    },
    "Merge Intervals": {
        hints: [
            "Sort the intervals by their start time first.",
            "Iterate through sorted intervals and compare the current interval with the last merged one.",
            "If they overlap, update the end time of the last merged interval."
        ],
        time: "O(n log n)",
        space: "O(n)"
    },
    "Container With Most Water": {
        hints: [
            "Think about using a two-pointer approach, one at the start and one at the end.",
            "The area is limited by the shorter line, so always move the pointer pointing to the shorter line inward.",
            "Keep track of the maximum area seen so far."
        ],
        time: "O(n)",
        space: "O(1)"
    },
    "Longest Substring Without Repeating Characters": {
        hints: [
            "Use a sliding window approach with two pointers.",
            "Maintain a set or hash map to keep track of characters in the current window.",
            "When a duplicate is found, shrink the window from the left until the duplicate is removed."
        ],
        time: "O(n)",
        space: "O(min(n, m))"
    }
};

let currentHintIndex = 0;
let currentProblemData = null;

document.getElementById("next-hint-btn")?.addEventListener("click", () => {
    const problemTitle = getProblemTitle();
    if (!problemTitle) return;

    const hintTextElement = document.getElementById("hint-text");
    const timeCompElement = document.getElementById("time-comp");
    const spaceCompElement = document.getElementById("space-comp");

    if (!currentProblemData) {
        // Use local database only
        if (hintDataBase[problemTitle]) {
            currentProblemData = hintDataBase[problemTitle];
        } else {
            currentProblemData = {
                hints: ["Sorry, no hints available for this problem in our database."],
                time: "?",
                space: "?"
            };
        }
        timeCompElement.textContent = currentProblemData.time;
        spaceCompElement.textContent = currentProblemData.space;
    }

    if (!currentProblemData || !currentProblemData.hints || currentProblemData.hints.length === 0) {
        hintTextElement.textContent = "No hints available.";
        return;
    }

    if (currentHintIndex < currentProblemData.hints.length) {
        hintTextElement.textContent = currentProblemData.hints[currentHintIndex];
        currentHintIndex++;
    } else {
        hintTextElement.textContent = "No more hints!";
    }
});

function getProblemTitle() {
    const titleElement = document.querySelector("div[data-cy = 'question-title']");
    if (titleElement) return titleElement.textContent.trim();

    // Fallback: Extract from URL slug
    const match = window.location.pathname.match(new RegExp("/problems/([^/]+)"));
    if (match && match[1]) {
        return match[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return null;
}

let lastProblemTitle = "";

function refreshUIForProblem() {
    const currentTitle = getProblemTitle();

    if (currentTitle && currentTitle !== lastProblemTitle) {
        currentHintIndex = 0;
        currentProblemData = null;
        lastProblemTitle = currentTitle;

        const hintText = document.getElementById("hint-text");
        if (hintText) {
            hintText.textContent = "Click next hint to begin.";
        }

        const titleDisplay = document.getElementById("prob-title");
        if (titleDisplay) {
            titleDisplay.textContent = currentTitle;
        }

        const timeCompElement = document.getElementById("time-comp");
        const spaceCompElement = document.getElementById("space-comp");
        if (timeCompElement) timeCompElement.textContent = "?";
        if (spaceCompElement) spaceCompElement.textContent = "?";

        // Load specific problem data
        const probData = getProblemData(currentTitle);
        if (probData) {
            const bookmarkBtn = document.getElementById("bookmark-btn");
            if (bookmarkBtn) {
                bookmarkBtn.textContent = probData.bookmarked ? "⭐" : "☆";
                bookmarkBtn.classList.toggle("bookmarked", probData.bookmarked);
            }

            const notesArea = document.getElementById("personal-notes");
            if (notesArea) {
                notesArea.value = probData.notes || "";
            }
        }
        updateDashboard();
    }
}

// Tab Switching Logic
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".panel").forEach(p => p.style.display = "none");

        e.target.classList.add("active");
        const targetPanel = document.getElementById(e.target.getAttribute("data-target"));
        if (targetPanel) targetPanel.style.display = "flex";
    });
});

// Bookmark Logic
document.getElementById("bookmark-btn")?.addEventListener("click", () => {
    const title = getProblemTitle();
    if (!title) return;

    const probData = getProblemData(title);
    const newStatus = !probData.bookmarked;
    updateProblemData(title, { bookmarked: newStatus });

    const btn = document.getElementById("bookmark-btn");
    btn.textContent = newStatus ? "⭐" : "☆";
    btn.classList.toggle("bookmarked", newStatus);
});

// Notes Logic
document.getElementById("save-notes-btn")?.addEventListener("click", () => {
    const title = getProblemTitle();
    if (!title) return;

    const notes = document.getElementById("personal-notes").value;
    updateProblemData(title, { notes: notes });

    const status = document.getElementById("save-status");
    status.textContent = "Saved!";
    setTimeout(() => status.textContent = "", 2000);
});

// Watch for LeetCode SPA navigation
const observer = new MutationObserver(() => {
    refreshUIForProblem();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial load check
setTimeout(() => refreshUIForProblem(), 1000);
