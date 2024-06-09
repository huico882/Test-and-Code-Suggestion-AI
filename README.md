# AI Test Case and Code Suggestion Generation Tool

## Project Overview

This script uses AI to enhance the autograding feature by focusing on two primary functionalities: `codeSuggestions` and `makeTestCases`, utilizing the `codellama` model to generate relevant outputs effectively. The feature still needs to be intergrated with the project, but you can start by downloading Ollama and running it on the server.

## Features

### `codeSuggestions`

- **Inputs**: Code, Language, Format
- **Function**: Generates a list of code suggestions based on the input parameters.
- **Output**: List of suggestions.

### `makeTestCases`

- **Inputs**: Question, Format (predefined by professors), NumberOfTestCases
- **Function**: Generates test cases based on the input specifications.
- **Output**: Test cases formatted in JSON.

## Research and Model Evaluation

During the project, we explored several AI and ML models to identify the most suitable options for our needs:

### Models Considered

- **GPT-3 (OpenAI)**: Initially considered due to its popularity and powerful capabilities in text generation. However, it was not used due to token limits and security concerns with sending data to external servers.
- **Hugging Face**: Offers a variety of models. The more effective models required subscriptions, and the free models did not meet our project's standards. Some documentation was also found to be outdated.
- **GPT-2 (OpenAI)**: Evaluated but found unsuitable for generating test cases due to its limitations in understanding and generating complex code patterns.
- **Ollama**: Chosen for its capability to run locally, enhancing data security. It provided easy setup instructions and was integrated into our project as a backend service.
- **Llama2-7b (Meta Platforms)**: Provided promising results in generating text and code. Although it was good at generating test cases, it often faced issues with consistency, such as maintaining the correct variable type and strictly adhering to the provided format.
- **Codellama-7b**: This model proved more effective and consistent in generating code and test cases compared to others. This the model used in this script.

### Documentation Links

- [OpenAI Text Generation Guide](https://platform.openai.com/docs/guides/text-generation)
- [Hugging Face Models](https://huggingface.co/models?pipeline_tag=text-generation&sort=trending)
- [Ollama API Guide](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion)
- [Ollama Home Page](https://ollama.com/)

## Example Output

Here is an example of the output from the `makeTestCases` function, which generates test cases for a course on programming principles:

```json
[
    { "id": 1, "hidden": false, "input": "4", "output": "1" },
    { "id": 2, "hidden": true, "input": "44444", "output": "1" },
    { "id": 3, "hidden": false, "input": "44443", "output": "0" },
    ...
]
```

## How to Use

This section provides a step-by-step guide on how to use the code for generating test cases based on specific questions and formats.

### Setup

First, ensure that you have the following structure in your project:

```
/project_root
  /generate
    /formats
      - test.txt
      ...
    /exampleCode
      - example.js
      ...
    TextGen.js
```

### Download Ollama onto Local Machine

To download Ollama onto your local machine, use the following command:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Download Codellama-7b into Local Machine

To download and run the Codellama-7b model on your local machine, use the following command:

```bash
ollama run codellama
```

## Example Usage

Here's an example of how to use the provided functionality to generate test cases:

**Import Functions**: Start by importing the necessary functions from `TextGen.js`.

```javascript
import {
  textGen,
  printTestCases,
  loadFileToString,
} from "./generate/TextGen.js";
```

### How to Generate Test Cases

1. **Define the Question**: Specify the question for which test cases need to be generated. For example:

```javascript
const question =
  "(a) Write a function given-positive-all-fours?, which when given a positive number, returns 1 if its decimal representation is all fours and 0 otherwise [Input should only be integers].⟨exercise transcripts 77a⟩≡ -> (Input: 4) 1 -> (Input: 44444) 1 -> (Input:44443) 0 -> (Input: 34) 0";
```

2. **Load the Format**: Load the desired format file for the test cases. Ensure that the format file exists in the `formats` directory.

```javascript
const format = await loadFileToString("generate/formats/test.txt");
```

3. **Generate and Print Test Cases**: Finally, generate and print the test cases by calling the `printTestCases` function.

```javascript
printTestCases(question, format, 10);
```

### How to Generate Code Suggestion

1. **Define the Question**: Specify the question for which test cases need to be generated. For example:

```javascript
const question =
  "(a) Write a function given-positive-all-fours?, which when given a positive number, returns 1 if its decimal representation is all fours and 0 otherwise [Input should only be integers].⟨exercise transcripts 77a⟩≡ -> (Input: 4) 1 -> (Input: 44444) 1 -> (Input:44443) 0 -> (Input: 34) 0";
```

2. **Load the Format**: Load the desired format file for the test cases. Ensure that the format file exists in the `formats` directory.

```javascript
const code = await loadFileToString("generate/exampleCode/example.js");
```

3. **Generate and Print Test Cases**: Finally, generate and print the test cases by calling the `printTestCases` function.

```javascript
printCodeSug(code, "Bug Identification", "Javascript");
```

## Notes

- The `loadFileToString` function is asynchronous and requires the use of `await` within an async function context.
- Ensure that the paths and filenames are correct to avoid loading errors.
