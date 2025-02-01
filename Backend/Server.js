import express from 'express';
import axios from 'axios';
const app = express();
const port = 5000;
import cors from 'cors';
import bodyParser from 'body-parser';

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Example JDoodle API credentials
const JDoodleClientID = "2b9684f9188b31dbfa801413ae3ecffa";
const JDoodleClientSecret = "178ad8764e881ac6a7b06e26a0c1cd9a19c43cf8310f54f019d6c8118e1a2959";

// Predefined test cases
const testCases = [
    { input: 2, expectedOutput: 4 },
    { input: 4, expectedOutput: 8 },
    // Add more test cases here
];

const correctValues = [1, 2];

app.post('/verify', (req, res) => {
    const { inputValues } = req.body;

    // Check if the number of inputs is correct
    if (inputValues.length !== correctValues.length) {
        return res.status(400).json({ message: 'Invalid number of inputs' });
    }

    // Verify if the input values match the correct values
    const isCorrect = inputValues.every((value, index) => parseInt(value) === correctValues[index]);

    if (isCorrect) {
        // If correct, get the current time as submission time
        const submissionTime = new Date().toLocaleString();

        // Return a success message along with the submission time
        return res.json({
            message: '✅ Success! Your output is correct.!',
            submissionTime: submissionTime,
        });
    } else {
        // If not correct, return a failure message
        return res.json({ message: '❌ Some values are incorrect. Please try again! ' });
    }
});


app.post('/outputverify', (req, res) => {
    const { userOutput } = req.body;
    
    const correctOutput = "20"; // Replace with the correct output

    if (userOutput.trim() === correctOutput) {
        console.log(userOutput);
        console.log(correctOutput);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/compile', async (req, res) => {
    const { language, code, action } = req.body;

    console.log(language);
    console.log(code);

    const languageMap = {
        python: { id: "python3", version: "4" },
        cpp: { id: "cpp17", version: "0" },
        java: { id: "java", version: "4" },
        c: { id: "c", version: "5" }
    };

    const selectedLanguage = languageMap[language] || languageMap.python;

    try {
        if (action === "run") {
            // For Run Code: Just execute the code and return the output
            const response = await axios.post('https://api.jdoodle.com/v1/execute', {
                clientId: JDoodleClientID,
                clientSecret: JDoodleClientSecret,
                script: code,
                language: selectedLanguage.id,
                versionIndex: selectedLanguage.version,
            });

            const result = response.data;
            res.json({
                output: result.output || result.error,
            });
            console.log(result.output); 
        } else if (action === "submit") {
            // For Submit: Check code against predefined test cases
            let failedTestCases = [];

            // Loop through test cases and apply them to the code
            for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i];

                // Modify user code to include test case input and print the output
                const userCodeWithTestCase = `${code}\nprint(${testCase.input})`;

                const response = await axios.post('https://api.jdoodle.com/v1/execute', {
                    clientId: JDoodleClientID,
                    clientSecret: JDoodleClientSecret,
                    script: userCodeWithTestCase,  // Pass modified code with the input
                    language: selectedLanguage.id,
                    versionIndex: selectedLanguage.version,
                });

                const result = response.data;
                const output = result.output.trim();

                // Compare the output with the expected output
                if (output !== testCase.expectedOutput.toString()) {
                    failedTestCases.push({
                        input: testCase.input,
                        expected: testCase.expectedOutput,
                        actual: output,
                        testCaseIndex: i + 1,
                    });
                }
            }

            if (failedTestCases.length > 0) {
                res.json({
                    success: false,
                    failedTestCases: failedTestCases,
                });
            } else {
                res.json({
                    success: true,
                    message: "All test cases passed!",
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error executing code' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
