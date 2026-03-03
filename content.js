// Prevent duplicate injection
if(!document.getElementById("dsa-mentor-box")) {
    const mentorbox = document.createElement("div");
    mentorbox.id = "dsa-mentor-box";

    mentorbox.innerHTML = `
        <h3>DSA Mentor</h3>
        <p><strong>Problem: </strong> ${getProblemTitle()}</p>

        <p id = "hint-text>Click next hint to begin.</p>
        <button id = "next-hint-btn">Next Hint</button>
    `
};

document.body.appendChild(mentorbox);

const hints = [
    "Understand what problem is asking carefully.",
    "Try solving it brute force first.",
    "Check constraints before finalising complexity",
    "Can you optimise using better data strutures?"
];

let currentHintIndex = 0;

document.getElementById("next-hint-btn").addEvenListner("click", () => {

    resetHintsIfProblemChanged();
    
    const problemTitle = getProblemTitle();
    const hints = hintDataBase[problemTitle];

    if(!hints) {
        document.getElementById("hint-text").textContent = "No hints available.";
        return;
    }

    if(currentHintIndex < hints.length) {
        document.getElementById("hint-text").textContent = hints[currentHintIndex];
        currentHintIndex++;
    }

    else {
        document.getElementById("hint-text").textContent = "No more hints!";
    }
});

function getProblemTitle() {
    const titleElement = document.querySelector("div[data-cy = 'question-title']");
    return titleElement ? titleElement.textContent.trim() : null;
}

const hintDataBase = {
    "Two Sum": [
        "Think about using a HashMap to store visited numbers.",
        "For each element, check if target - current exists.",
        "Time complexity can be O(n)."
    ],

    "Valid Parentheses": [
        "This problem involves matching opening and closing brackets.",
        "Consider using a stack data structure",
        "Push opening brackets, pop when closing bracket appears."
    ],

    "Binary Tree Level Order Traversal": [
        "This is a classic BFS problem.",
        "Use a queue to traverse level-by-level",
        "Track nodes per level using loop size."
    ]
};

let lastProblemTitle = "";

function resetHintsIfProblemChanged() {
    const currentTitle = getProblemTitle();

    if(currentTitle !== lastProblemTitle) {
        currentHintIndex = 0;
        lastProblemTitle = currentTitle;

        const hintText = document.getElementById("hint-text");
        if(hintText) {
            hintText.textContent = "Click next hint to begin";
        }
    }

}


// Displayed hint will stay for now, as no action has been declared after hint displaying
// means: LeetCode is a React SPA.

// When you click another problem:

// The URL changes

// The DOM changes

// BUT the page does NOT fully reload

// So content.js does NOT rerun.
// For this, we are using "MutationObserver"
// MutationObserver is a powerful browser API that watches the DOM for changes
// When something changes it runs your function.

const observer = new MutationObserver(() => {
    const currentTitle = getProblemTitle();

    if(currentTitle && currentTitle != lastTitle) {
        currentHintIndex = 0;
        lastProblemTitle = currentTitle;

        const hintText = document.getElementById("hint-text");
        if(hintText) {
            hintText.textContent = "Click next hint to begin.";
        }
    }
});

observer.observe(document.body, /* Start observing changes inside the entire <body> of the page. */ {
    childList: true,
    subtree: true
});

/* Without subtree: true:
It only watches direct children of document.body.*/

/*
With subtree: true:
It watches ALL nested elements inside body.

So basically:
body
body → div
body → div → div
body → div → div → span
Everything.
*/


