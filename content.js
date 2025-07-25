// content.js
console.log("LeetCode DSA Helper content script loaded!");

function getTextContent(selector) {
    const element = document.querySelector(selector);
    return element ? element.innerText.trim() : null;
}

function getCodeFromEditor() {
    const monacoEditor = document.querySelector('.monaco-editor');
    if (monacoEditor) {
        const codeLines = monacoEditor.querySelectorAll('.view-lines span');
        let code = '';
        codeLines.forEach(line => {
            code += line.textContent + '\n';
        });
        return code.trim();
    }

    const aceEditor = document.querySelector('.ace_editor');
    if (aceEditor && aceEditor.ace && aceEditor.ace.getSession) {
         const code = aceEditor.ace.getSession().getValue();
         return code.trim();
    }

    console.warn("Could not find code editor content.");
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLeetCodeData") {
        const problemTitle = getTextContent('.text-title-large.font-semibold.text-text-primary');
        const problemDescription = getTextContent('[data-track-load="description_content"]');
        const userCode = getCodeFromEditor();

        if (problemTitle && problemDescription && userCode) {
            sendResponse({
                success: true,
                data: { problemTitle, problemDescription, userCode }
            });
        } else {
            sendResponse({
                success: false,
                message: "Failed to capture all required data from LeetCode page. Please ensure you have code in the editor and the problem description is visible."
            });
        }
        return true;
    }
});
