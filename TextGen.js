import fetch from "node-fetch"; // Or const fetch = require('node-fetch');
import { promises as fs } from "fs";

// REQUEST

/**
 * Makes an HTTP POST request to a Ollama with the given payload and returns the JSON response.
 *
 * @param {Object} payload - The data to be sent as the body of the request. It should be an object that can be serialized into JSON.
 * @returns {Promise<Object|null>} A promise that resolves to the parsed JSON data if the request is successful,
 *                                 or null if an error occurs.
 * @throws {Error} Throws an error if the network response is not OK
 * @async
 */
async function makeRequest(payload) {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // Parse JSON response
    return data; // Return the data so it can be used by the caller
  } catch (error) {
    console.error("Error:", error);
    return null; // Optionally return null or handle the error differently
  }
}

//      CODE SUGGESTIONS

/**
 * Asynchronously reads the contents of a file at a specified path into a string.
 *
 * @param {string} filePath - The path to the file that needs to be read.
 * @returns {Promise<string|null>} A promise that resolves to a string containing the contents of the file if successfully read,
 *                                 or null if an error occurs.
 * @async
 */
export async function loadFileToString(filePath) {
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return fileContents;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

/**
 * Generates code suggestions for the given source code by sending it to an API.
 * The function formats the request specifically for the code language and the type of formatting or analysis desired.
 *
 * @param {string} code The source code for which suggestions are needed.
 * @param {string} format The type of suggestions or formatting to apply (e.g., "formatting", "error checking").
 * @param {string} lang The programming language of the code (e.g., "JavaScript", "Python").
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the API, which contains the code suggestions.
 * @async
 */
export async function codeSuggestions(code, format, lang) {
  const payload = {
    model: "codellama",
    messages: [
      {
        role: "user",
        content:
          "As an assistant, please review the provided " +
          lang +
          " code, focusing on " +
          format,
      },
      {
        role: "assistant",
        content: "Hi, please provide the code that you want suggestions for",
      },
      {
        role: "user",
        content: code,
      },
    ],
    stream: false, // Set to true if you want streaming responses
  };

  return await makeRequest(payload);
}

/**
 * Prints code suggestions based on the provided code, formatting style, and language.
 * This function makes use of the `codeSuggestions` function to obtain results from Ollama and then prints those results.
 * Intended for debugging or demonstration purposes to quickly view the output of code suggestions.
 *
 * @param {string} code The source code for which suggestions are to be generated.
 * @param {string} format The desired format or type of analysis to be applied to the code (e.g., "style check", "bug identification").
 * @param {string} lang The programming language of the code (e.g., "JavaScript", "Python").
 * @returns {Promise<void>} A promise that resolves when the results have been printed to the console. No return value.
 * @async
 */
export async function printCodeSug(code, format, lang) {
  const results = await codeSuggestions(code, format, lang);

  console.log(results.message.content);
}

// TEST CREATOR

/**
 * Extracts a JSON array called "test" from a given text string by searching for the pattern "test" followed by any amount of whitespace,
 * a colon, and then an array enclosed in brackets (JSON formated code). If the pattern is found, it attempts to parse and return the array.
 *
 * @param {string} text The text from which to extract the test array.
 * @returns {Array|null} Returns the extracted array if successful, or null if no array is found or parsing fails.
 */
function extractTestArrayFromText(text) {
  // This regex looks for "test" followed by any number of spaces, a colon, and then an array.
  const regex = /"test"\s*:\s*(\[[^\]]*\])/;
  const match = text.match(regex);

  if (match && match[1]) {
    try {
      // Parse the matched array string into a JavaScript array
      const testArray = JSON.parse(match[1]);
      return testArray;
    } catch (error) {
      console.error("Failed to parse the extracted array:", error);
    }
  } else {
    console.error("No test array found in the text.");
  }

  return null;
}

/**
 * Generates test cases for a given question by sending a request to Ollama, specified to return only JSON-formatted code suggestions.
 *
 * @param {string} question The programming or computational question for which test cases are needed.
 * @param {string} format The format in which the test cases should be returned, as specified by the user.
 * @param {number} numOfCases The number of test cases to generate.
 * @returns {Promise<Object>} A promise that resolves to the JSON object containing the generated test cases.
 * @async
 */
export async function makeTestCases(question, format, numOfCases) {
  // Define your payload
  const payload = {
    model: "codellama",
    messages: [
      {
        role: "user",
        content:
          "Without any comments or context, Generate " +
          numOfCases +
          " test cases for this question, (" +
          question +
          " ), include cases such as edge cases, large cases. The output should strictly be in JSON format, adhering to the template provided: ( " +
          format +
          " )\n *** ONLY RETURN CODE <<<< DO NOT number it or anything, simply return code. Make sure to have" +
          numOfCases +
          "  tests cases and all parameters ***",
      },
    ],
    stream: false, // Set to true if you want streaming responses
  };

  return await makeRequest(payload);
}

/**
 * Prints newly generated test cases for a given question, formatting type, and number of test cases.
 * This function uses `makeTestCases` to request and retrieve test cases from an Ollama and parses
 * results and only displays the test cases part of the JSON response.
 *
 *
 * @param {string} question The question for which test cases are needed, typically a programming or algorithm challenge.
 * @param {string} format The desired format or type of analysis to be applied to generating the test cases.
 * @param {number} numOfCases The number of test cases to generate.
 * @returns {Promise<void>} A promise that resolves when the test cases have been printed to the console.
 * @async
 */
export async function printTestCases(question, format, numOfCases) {
  const results = await makeTestCases(question, format, numOfCases);

  //extract test from JSON response
  const tests = extractTestArrayFromText(results.message.content);

  await console.log(results);
  return await console.log(tests);
  // return await console.log(results); // return this if you want to see the whole response
}

/*  Prints any given content */
async function print(content) {
  return await console.log(content);
}

/**
 * Generates text given a prompt
 *
 * @param {string} prompt The prompt being sent to AI model.
 * @returns {Promise<void>} A promise that resolves to the JSON object containing the generated text.
 * @async
 */
export async function textGen(prompt) {
  // Define your payload
  const payload = {
    model: "codellama",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: false, // Set to true if you want streaming responses
  };

  return await makeRequest(payload);
}
