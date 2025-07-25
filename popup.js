// popup.js
// IMPORTANT: This URL must point to your locally running backend server.
// The default port for functions-framework is 8080.
const BACKEND_API_URL = "http://localhost:8080/"; // Changed to local server URL

document.addEventListener('DOMContentLoaded', () => {
    const getHintBtn = document.getElementById('getHintBtn');
    const reviewCodeBtn = document.getElementById('reviewCodeBtn');
    const llmResponseDiv = document.getElementById('llmResponse');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const initialMessage = document.getElementById('initialMessage');

    // Function to set loading state for a SPECIFIC button
    function setLoadingState(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return; // Guard against null button

        const buttonTextSpan = button.querySelector('.button-text');
        const spinnerSpan = button.querySelector('.spinner');

        if (isLoading) {
            // Disable both buttons to prevent concurrent requests,
            // but only show spinner on the clicked one.
            getHintBtn.disabled = true;
            reviewCodeBtn.disabled = true;
            getHintBtn.style.cursor = 'not-allowed';
            reviewCodeBtn.style.cursor = 'not-allowed';


            buttonTextSpan.style.opacity = '0'; // Fade out text of the clicked button
            spinnerSpan.setAttribute('aria-hidden', 'false'); // Show spinner of the clicked button
            spinnerSpan.style.opacity = '1';

            // Show loading message with fade-in
            initialMessage.style.opacity = '0';
            llmResponseDiv.style.opacity = '0';
            errorMessage.style.opacity = '0';
            setTimeout(() => {
                initialMessage.style.display = 'none';
                llmResponseDiv.style.display = 'none';
                errorMessage.style.display = 'none';
                loadingMessage.style.display = 'flex'; // Use flex to center loading message
                setTimeout(() => loadingMessage.style.opacity = '1', 10); // Small delay for display block to apply
            }, 300); // Wait for button text fade-out
        } else {
            // Re-enable both buttons
            getHintBtn.disabled = false;
            reviewCodeBtn.disabled = false;
            getHintBtn.style.cursor = 'pointer';
            reviewCodeBtn.style.cursor = 'pointer';

            buttonTextSpan.style.opacity = '1'; // Fade in text of the clicked button
            spinnerSpan.setAttribute('aria-hidden', 'true'); // Hide spinner of the clicked button
            spinnerSpan.style.opacity = '0';
            loadingMessage.style.opacity = '0';
            // The display property of loadingMessage will be set to 'none' by displayResponse/displayError
            // after its opacity transition
            setTimeout(() => loadingMessage.style.display = 'none', 300); // Hide after fade out
        }
    }

    // Function to display an error with fade-in (simplified)
    function displayError(message) {
        errorMessage.textContent = `Error: ${message}`;
        errorMessage.style.opacity = '0';
        errorMessage.style.display = 'flex';
        llmResponseDiv.style.display = 'none';
        initialMessage.style.display = 'none';
        loadingMessage.style.display = 'none';
        setTimeout(() => errorMessage.style.opacity = '1', 10);
    }

    // Function to display LLM response (simplified - no typewriter)
    function displayResponse(response) {
        llmResponseDiv.textContent = response;
        llmResponseDiv.style.opacity = '0';
        llmResponseDiv.style.display = 'block';
        errorMessage.style.display = 'none';
        initialMessage.style.display = 'none';
        loadingMessage.style.display = 'none';
        setTimeout(() => llmResponseDiv.style.opacity = '1', 10);
    }

    // Function to get data from content script (no changes)
    async function getDataFromContentScript() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) {
                    reject("No active tab found. Please open LeetCode problem page.");
                    return;
                }
                const activeTabId = tabs[0].id;

                chrome.tabs.sendMessage(activeTabId, { action: "getLeetCodeData" }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(`Could not communicate with LeetCode page. Make sure you are on a problem page. Details: ${chrome.runtime.lastError.message}`);
                        return;
                    }
                    if (response && response.success) {
                        if (!response.data.problemTitle || !response.data.problemDescription || !response.data.userCode) {
                            reject("Could not capture all data from LeetCode page. Please ensure you have code in the editor and the problem description is visible.");
                        } else {
                            resolve(response.data);
                        }
                    } else {
                        reject(response ? response.message : "Failed to get data from LeetCode page for an unknown reason.");
                    }
                });
            });
        });
    }

    // Generic function to handle API calls (no changes)
    async function callBackendAndDisplay(type, buttonId) {
        try {
            setLoadingState(buttonId, true);

            const leetCodeData = await getDataFromContentScript();
            console.log("Captured LeetCode Data:", leetCodeData);

            console.log("Sending data to backend for", type, "...");
            const response = await fetch(BACKEND_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type,
                    title: leetCodeData.problemTitle,
                    description: leetCodeData.problemDescription,
                    code: leetCodeData.userCode
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Backend error: ${response.status} - ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            const llmOutput = data.response;

            console.log("Received LLM Output:", llmOutput);
            displayResponse(llmOutput);

        } catch (error) {
            console.error("Error in popup:", error);
            displayError(error.message);
        } finally {
            setLoadingState(buttonId, false);
        }
    }

    // Event Listeners for buttons (no changes)
    getHintBtn.addEventListener('click', () => callBackendAndDisplay('hint', 'getHintBtn'));
    reviewCodeBtn.addEventListener('click', () => callBackendAndDisplay('review', 'reviewCodeBtn'));
});
