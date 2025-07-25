<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/A-coolcreator/Tailored_DSA_hints">
    <!-- Replace with your actual logo if you have one. Ensure it's in the 'images/' folder. -->
    <img src="https://placehold.co/80x80/FF8C00/FFFFFF?text=DSA" alt="LeetCode DSA Helper Logo" width="80" height="80">
  </a>

  <h3 align="center">LeetCode DSA Helper Chrome Extension</h3>

  <p align="center">
    Your intelligent coding companion for Data Structures & Algorithms problems on LeetCode.
    <br />
    <br />
    <a href="#get-started"><strong>Explore the setup guide »</strong></a>
    <br />
    <br />
    <a href="https://github.com/A-coolcreator/Tailored_DSA_hints/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/A-coolcreator/Tailored_DSA_hints/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#demo">Demo</a></li>
    <li><a href="#get-started">Get Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
        <li><a href="#run-locally-backend-server">Run Locally (Backend Server)</a></li>
        <li><a href="#installation-chrome-extension">Installation (Chrome Extension)</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

The LeetCode DSA Helper is a Chrome extension designed to assist users in solving Data Structures and Algorithms (DSA) problems on the LeetCode platform. It integrates directly into the LeetCode problem page, allowing users to request personalized hints and code reviews for their solution attempts. This tool aims to foster a deeper understanding of DSA concepts by providing guided assistance rather than direct answers, encouraging active problem-solving.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Features

* **Personalized Hints:** Receive concise, one-line hints tailored to your current code and the specific LeetCode problem, gently guiding your thought process without revealing the direct solution.
* **Code Review:** Get constructive feedback on your code's overall approach, potential time and space complexity issues, and suggestions for improvement.
* **Seamless Integration:** Works directly within the LeetCode problem page, automatically extracting problem details and your code from the editor.
* **Modern UI:** A clean, minimalist, light-themed popup interface with smooth animations and clear loading indicators, designed for an intuitive user experience.
* **Secure & Private:** Your AI interactions are processed through a local backend server, ensuring your API key and sensitive code remain private on your machine.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* **Frontend (Chrome Extension):**
    * HTML, CSS (Custom styling)
    * JavaScript (Vanilla JS for Chrome Extension logic)
* **Backend (Local Server):**
    * Python 3
    * `functions-framework` (for local server execution)
    * `google-generativeai` (for Gemini API interaction)
    * `python-dotenv` (for environment variable management)
    * `Flask-Cors` (for handling CORS in local development)
* **AI Model:**
    * Google Gemini 1.5 Flash

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Demo



![Product Demo](https://github.com/A-coolcreator/Tailored_DSA_hints/blob/main/product_demo.png?raw=true)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Get Started

To get started with the LeetCode DSA Helper, you'll need to set up a local backend server on your machine and install the Chrome extension.

### Prerequisites

Before you begin, ensure you have:
* [**Python 3**](https://www.python.org/downloads/) installed on your system.
* **`pip`** (Python package installer), which usually comes with Python 3.
* [**Git**](https://git-scm.com/) installed to clone the repository.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Environment Variables

This project uses environment variables to securely manage your API key.

* **`GEMINI_API_KEY`**: Your API key for accessing Google's Gemini AI models.
    * **How to get it:** Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key.
    * **How to use it:** In the `backend/` folder of this project, create a new file named `.env` (note the leading dot). Add the following line to this `.env` file, replacing `YOUR_GEMINI_API_KEY_HERE` with your actual key:
        ```
        GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
        ```
    * **Security Note:** The `.env` file should **NEVER** be committed to public version control (like GitHub). A `.gitignore` file is included in the project to help prevent this.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Run Locally (Backend Server)

This section guides you through setting up and running the local Python backend server. This server must be running for the Chrome extension to function.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-github-username/LeetCode-DSA-Helper.git](https://github.com/your-github-username/LeetCode-DSA-Helper.git)
    ```
    *(**Important:** Replace `your-github-username` with your actual GitHub username and `LeetCode-DSA-Helper` with your repository name if you forked it.)*
2.  **Navigate to the Project Directory:**
    ```bash
    cd LeetCode-DSA-Helper
    ```
3.  **Navigate to the Backend Folder:**
    ```bash
    cd backend
    ```
4.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Start the Local Server:**
    ```bash
    functions-framework --target dsa_helper_llm_api --port 8080
    ```
    * **Keep this terminal window open!** The server needs to be continuously running for the extension to work. You'll see logs from the server here.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Installation (Chrome Extension)

This section guides you through installing the Chrome extension in your browser.

1.  **Update `manifest.json`:**
    * Open the `manifest.json` file in the root of your `LeetCode-DSA-Helper` project folder.
    * Ensure the `host_permissions` array includes `http://localhost:8080/`. This allows your extension to communicate with your local backend.
        ```json
        "host_permissions": [
          "[https://leetcode.com/problems/](https://leetcode.com/problems/)*",
          "http://localhost:8080/"  // Ensure this line is present
        ],
        ```
2.  **Update `popup.js`:**
    * Open the `popup.js` file in the root of your `LeetCode-DSA-Helper` project folder.
    * Ensure the `BACKEND_API_URL` constant points to your local server:
        ```javascript
        const BACKEND_API_URL = "http://localhost:8080/"; // Ensure this is set correctly
        ```
3.  **Load Unpacked Extension in Chrome:**
    * Open your Chrome browser.
    * Go to `chrome://extensions` in the address bar.
    * Enable "Developer mode" (toggle switch in the top-right corner).
    * Click the "Load unpacked" button.
    * Navigate to and select your **root project folder** (the `LeetCode-DSA-Helper` folder that contains `manifest.json`, `popup.html`, etc.). Click "Select Folder."
    * You should see "LeetCode DSA Helper" appear in your extensions list.
4.  **Hard Reload Extension:**
    * To ensure all changes (especially CSS and JavaScript updates) are applied, while on the `chrome://extensions` page, **toggle your "LeetCode DSA Helper" extension OFF, wait 2 seconds, then toggle it ON again.**

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

Once both your local backend server is running and the Chrome extension is installed:

1.  Navigate to any LeetCode problem page (e.g., `https://leetcode.com/problems/two-sum/`).
2.  Type your code into the editor.
3.  Click the "LeetCode DSA Helper" extension icon in your browser toolbar to open the popup.
4.  Choose either "Get Personalized Hint" or "Review My Code."
5.  The AI's response will appear dynamically within the popup!

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- FAQ -->
## FAQ

#### Won't this make people lazy?

* **Yes, if:** Users rely on the extension to provide immediate answers without genuine effort. We strongly recommend attempting problems independently first.
* **No, if:** Users engage in the initial problem-solving and "mental heavy lifting" themselves. They use the extension only when they encounter a significant mental block or want to validate their approach after attempting a solution.


Our goal is to assist, not replace, the learning process. This extension is most effective when used as a supplementary tool

#### Are the hints/reviews unlimited?

Yes, for practical purposes, the hints and reviews are effectively unlimited! This is thanks to the very generous free tier provided by Google's Gemini API.

#### Do I need a powerful computer to run this?

The AI processing happens on Google's servers (via your local backend proxy), so your computer only needs to run a lightweight Python server. If your machine can comfortably run Chrome and Python, it should be sufficient.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

* Implement a persistent chat history for progressive hints within the popup.
* Explore more advanced AI capabilities (e.g. complexity analysis breakdown).
* Improve error messaging and user feedback.
* Add options for users to customize AI behavior (e.g., hint verbosity).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

[Aditya Chandil] - [adityachandilofficial@gmail.com]

Project Link: [https://github.com/your-github-username/LeetCode-DSA-Helper](https://github.com/your-github-username/LeetCode-DSA-Helper)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Google Cloud Platform](https://cloud.google.com/) for providing the AI and serverless infrastructure.
* [LeetCode](https://leetcode.com/) for providing an excellent platform for DSA practice.



<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/your-github-username/LeetCode-DSA-Helper.svg?style=for-the-badge
[contributors-url]: https://github.com/your-github-username/LeetCode-DSA-Helper/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your-github-username/LeetCode-DSA-Helper.svg?style=for-the-badge
[forks-url]: https://github.com/your-github-username/LeetCode-DSA-Helper/network/members
[stars-shield]: https://img.shields.io/github/stars/your-github-username/LeetCode-DSA-Helper.svg?style=for-the-badge
[stars-url]: https://github.com/your-github-username/LeetCode-DSA-Helper/stargazers
[issues-shield]: https://img.shields.io/github/issues/your-github-username/LeetCode-DSA-Helper.svg?style=for-the-badge
[issues-url]: https://github.com/your-github-username/LeetCode-DSA-Helper/issues
[license-shield]: https://img.shields.io/github/license/your-github-username/LeetCode-DSA-Helper.svg?style=for-the-badge
[license-url]: https://github.com/your-github-username/LeetCode-DSA-Helper/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0077B5
[linkedin-url]: https://linkedin.com/in/your-linkedin-profile
