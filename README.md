Problem we want to solve:
    We want to successfully web scrape e-commerce sites that don't provide a public API

What we will do:
    We will use a headless browser with a proxy go-through to access the HTML of the desired page,
    then use chat-gpt to analyze the desired markup & write scraping and formatting code for us.
    The proxy browser will be necessary to prevent IP blocking by the e-commerce site.

Instructions:
    1. Create an instance of a scraping browser using bright data management console
    2. Navigate to access parameters and grab username, password & host url
    3. Enter those values within .env file
    4. Check page.goto url is the desired url
    5. Manually navigate to said url and use chrome dev tools to find desired selector for items to scrape
    6. Run node . & grab desired innerHTML from console
    7. Use this innerHTML to prompt chat-gpt for extraction code
    8. Copy/paste extraction code from chat-gpt response into new js file (as seen in example files)
    9. Run this new web scraping logic gain products data in desired shape
    10. IMPORTANT: Disable bright data service & test to confirm
    Result: Your desired products data is successfully scraped!


Improvements:
    1. Remove manual selector search by programmatically searching through entire page body for elements with 
    desired string descriptions and element types, like "best sellers" followed by an ol element.

    2. Use Plugin to programmatically pass prompt with html text to LLM and recieve requested code/selectors.

    3. Chat-GPT can sometimes provide improper selectors for code execution.  An AI powered code
    interpretation pipeline (like Chat-gpt's Code Interpreter feature) could be used to check selector query logic
    after initial html scrape to ensure proper output of desired data.

    New Result:  Same data is scraped, but now without any human intervention after initial setup.  The programmer only need
    provide an array of desired pages to scrape to the run() function.


Extra thoughts: 
    We want to feed the system instructions so that it understands
    the primary problem is the faulty selector strings in order to keep system performant with less iterations till successful execution.
    JavaScript may not be the best language for this sort of task.  Python may be better for searching through html to find ideal selectors,
    as described in improvement #1.