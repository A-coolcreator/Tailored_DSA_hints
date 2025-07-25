import os
import functions_framework
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from dotenv import load_dotenv # NEW: For loading .env file
from flask_cors import CORS # NEW: For handling CORS in local development

# Load environment variables from .env file
load_dotenv()

# --- START CHANGES FOR LOCAL BACKEND ---

# Get Gemini API Key from environment variables (loaded from .env)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables or .env file.")

# For local development, you might set a placeholder project ID and location
# as they are not strictly used for direct API calls, but vertexai.init requires them.
# For actual cloud deployment, these would be managed by GCP itself.
PROJECT_ID = os.environ.get("PROJECT_ID", "your-gcp-project-id-placeholder")
LOCATION = os.environ.get("LOCATION", "us-central1")

# Initialize Vertex AI (this is more for context/logging in local setup, actual auth is via API key)
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
except Exception as e:
    print(f"Warning: Could not initialize Vertex AI context locally: {e}. Ensure PROJECT_ID and LOCATION are set if needed for other Vertex AI features.")

# Initialize the Generative Model with the API key
# Note: For direct API calls, the model name might be slightly different
# from Vertex AI models. "gemini-pro" is a common direct API model.
# You might need to check Google's Generative Language API documentation for exact model names.
try:
    # Using the direct Generative Language API endpoint requires a different model instance setup
    # from Vertex AI's GenerativeModel.
    # For direct API calls, you'd typically use google.generativeai client, not vertexai.generative_models
    # Let's adapt this for functions-framework to act as a simple proxy to the direct Generative Language API
    import google.generativeai as genai # NEW: Import for direct API access

    genai.configure(api_key=GEMINI_API_KEY)
    model_instance = genai.GenerativeModel('gemini-1.5-flash') # Using gemini-1.5-flash for direct API

except Exception as e:
    print(f"Error initializing Generative AI model: {e}")
    raise RuntimeError(f"Failed to load Gemini model. Check GEMINI_API_KEY and model name. Error: {e}")

# --- END CHANGES FOR LOCAL BACKEND ---


@functions_framework.http
def dsa_helper_llm_api(request):
    # For local development, functions-framework might not handle CORS automatically.
    # We'll add Flask-CORS for local testing.
    # When deployed to Cloud Functions, GCP handles CORS based on the 'Access-Control-Allow-Origin' header.
    # For local testing, ensure your local server allows requests from your extension's origin.
    
    # Initialize CORS for the function (this is handled by Flask-CORS when run locally)
    # For deployed Cloud Function, the headers below are sufficient.
    
    # Set CORS headers for preflight requests
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*', # Allow all origins for local dev
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*' # Allow all origins for local dev
    }

    request_json = request.get_json(silent=True)
    if not request_json:
        return ({'error': 'Invalid JSON body'}, 400, headers)

    request_type = request_json.get('type')
    problem_title = request_json.get('title')
    problem_description = request_json.get('description')
    user_code = request_json.get('code')

    if not all([request_type, problem_title, problem_description, user_code]):
        return ({'error': 'Missing required data: type, title, description, or code'}, 400, headers)

    prompt = ""
    if request_type == 'hint':
        prompt = f"""
        You are an expert Data Structures and Algorithms (DSA) tutor providing **conceptual guidance and strategic hints**.
        Your primary goal is to guide the student's thought process without ever revealing the direct solution or writing any code.
        Focus on nudging them towards optimal approaches, relevant data structures, or identifying flaws in their current logic.

        ---
        **Problem Title:** {problem_title}
        **Problem Description:**
        {problem_description}
        ---
        **Student's Current Code Approach:**
        ```
        {user_code}
        ```
        ---

        Based on the above problem and the student's current code, provide a **single, highly concise, one-sentence hint or a guiding question**.
        Ensure your hint encourages deeper thought and problem-solving without giving away the answer.
        **Strictly adhere to these rules:**
        1.  **One sentence only.**
        2.  **No code snippets or pseudocode.**
        3.  **Do not provide the full solution or a direct algorithm.**
        4.  Focus on the *idea* or *direction*.
        """
    elif request_type == 'review':
        prompt = f"""
        You are an expert Data Structures and Algorithms (DSA) code reviewer.
        Your goal is to provide a concise, constructive review of the student's code, focusing on:
        -   **Overall approach effectiveness (e.g., correct logic, edge cases).**
        -   **Potential time or space complexity issues.**
        -   **Common pitfalls or alternative, more efficient data structures/algorithms that could be considered.**
        -   **Readability and best practices (briefly).**

        **Crucially, do NOT provide the complete corrected solution or direct code.** Guide them to improve their existing code.
        Keep the review reasonably concise, aiming for 2-4 sentences or a few bullet points.

        ---
        **Problem Title:** {problem_title}
        **Problem Description:**
        {problem_description}
        ---
        **Student's Current Code:**
        ```
        {user_code}
        ```
        ---

        Provide your code review:
        """
    else:
        return ({'error': 'Invalid request type. Must be "hint" or "review"'}, 400, headers)

    try:
        # Use the configured model_instance
        response = model_instance.generate_content( # CHANGED: Use model_instance
            prompt,
            generation_config={"temperature": 0.5, "max_output_tokens": 300}
        )

        llm_output = ""
        if response.candidates and response.candidates[0].content and response.candidates[0].content.parts:
            llm_output = response.candidates[0].content.parts[0].text.strip()
        else:
            print("LLM response content was empty or filtered.")
            if response.candidates:
                print(f"Full candidate object: {response.candidates[0]}")
            llm_output = "No response generated, possibly due to safety filters or an empty model output. Try rephrasing or a different problem."
            print(f"Finish reason: {response.candidates[0].finish_reason if response.candidates else 'N/A'}")
            
        print(f"LLM Response: {llm_output}")

        return ({'response': llm_output}, 200, headers)

    except Exception as e:
        print(f"Error calling LLM: {e}")
        return ({'error': f'Failed to get LLM response: {str(e)}'}, 500, headers)

