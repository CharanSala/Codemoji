import React, { useState } from 'react';
import Navbar from './Navbar';  // Assuming you have Navbar component
import MonacoEditor from '@monaco-editor/react';  // Monaco editor for code writing

// Round 1 Component
const Round1 = () => {

    const Emojicode = `
    🔢 = 123456  
    🔡 = [ ]  
    🔢1 = [ ]  
    🔁(🔢 > 0) {  
        📍 = 🔢 % 10  
        🤔(📍 ⚖️ 2) 👉 🔡 ➕= 📍  
        🤔(📍 ⚖️ 4) 👉 🔡1 ➕= 📍  
        🔢 ➗= 10  
    }  
    📜 = 🔡 ➕🔡1  
    🔁(📜 📏 > 0) {  
        📍 = 📜 % 10  
        🤔(📍 ⚖️ 5) 👉 📜 ➖= 1  
    }  
    ✍️(📜)  

    `;
    const [selectedLanguage, setSelectedLanguage] = useState("python");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [testResults, setTestResults] = useState([]);

    const exampleTestCases = [
        { input: "emoji code 1", output: "expected output 1" },
        { input: "emoji code 2", output: "expected output 2" },
    ];

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };

    const handleRunCode = async () => {
        try {
            const response = await fetch('http://localhost:5000/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: selectedLanguage, code: code, action: "run" }),
            });

            if (!response.ok) {
                throw new Error('Error executing code');
            }

            const result = await response.json();
            if (result.output) {
                setOutput(result.output);
            } else {
                setOutput('No output received from backend.');
            }
        } catch (error) {
            console.error('Error:', error);
            setOutput('Error running the code: ' + error.message);
        }
    };

    const handleSubmit = async () => {
        let results = [];
        for (let testCase of exampleTestCases) {
            const response = await fetch('http://localhost:5000/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: selectedLanguage, code: code, action: "submit" }),
            });

            const result = await response.json();
            const isTestPassed = result.output.trim() === testCase.output.trim();
            results.push({ input: testCase.input, output: result.output, passed: isTestPassed });
        }

        setTestResults(results);
    };

    return (
        <div className="flex justify-between p-6 space-x-5">
            <div className="w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Emoji Code</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                    <p>🎯 <strong>Task:</strong> Convert this emoji-based code into a valid program.</p>
                    <pre>{Emojicode}</pre>
                    <div className="">
                        <h4 className="font-semibold text-lg">Test Cases</h4>
                        {exampleTestCases.map((testCase, index) => (
                            <div key={index} className="mt-2">
                                <p><strong>Input:</strong> {testCase.input}</p>
                                <p><strong>Output:</strong> {testCase.output}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Write Your Code</h3>

                <div className="mb-4">
                    <select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        className="p-2 border rounded-md"
                    >
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="java">Java</option>
                    </select>
                </div>

                <MonacoEditor
                    height="400px"
                    language={selectedLanguage === "python" ? "python" : selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "java" ? "java" : "c"}
                    theme="vs-light"
                    value={code}
                    onChange={(value) => setCode(value)}
                />

                <button
                    onClick={handleRunCode}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                    Run Code
                </button>

                <button
                    onClick={handleSubmit}
                    className="mt-4 mr-5 ml-4 px-6 py-2 bg-green-500 text-white rounded-md"
                >
                    Submit
                </button>

                <div className="mt-4">
                    <h4 className="text-lg font-semibold">Output</h4>
                    <pre className="bg-gray-100 p-4 rounded-md">{output || 'No output yet.'}</pre>
                </div>

                <div className="mt-4">
                    <h4 className="text-lg font-semibold">Test Case Results</h4>
                    {testResults.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {testResults.map((testResult, index) => (
                                <li key={index} className={testResult.passed ? 'text-green-600' : 'text-red-600'}>
                                    <strong>Input:</strong> {testResult.input} <br />
                                    <strong>Output:</strong> {testResult.output} <br />
                                    <strong>Status:</strong> {testResult.passed ? 'Passed' : 'Failed'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No test results yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Round 2 Component (your new round)
const Round2 = () => {
const incompleteCode = `
    📌 fact(🔢) {
        🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
        ↩️ 🔢 ✖️ fact(🔢 ➖ 1)
    }
    `;

    const predefinedValues = [1, 2];
    const [inputValues, setInputValues] = useState(new Array(predefinedValues.length).fill(''));
    const [resultMessage, setResultMessage] = useState('');
    const [subtime, setSubtime] = useState('');

    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputValues }),
            });

            if (!response.ok) {
                throw new Error('Error verifying inputs');
            }

            const result = await response.json();
            setResultMessage(result.message);
            setSubtime(result.submissionTime);
        } catch (error) {
            console.error('Error:', error);
            setResultMessage('Error verifying inputs: ' + error.message);
        }
    };

    return (
        <div className="flex justify-between p-6">

            <div className="w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Identify the Missing Values</h3>
                {subtime && (
                    <div className="mb-4 text-lg font-bold text-green-600">
                        Submission Time: {subtime}
                    </div>
                )}
                <div className="bg-gray-100 p-4 rounded-md">
                    <p><strong>Task:</strong> Identify and provide the missing values in the incomplete code.</p>
                    <pre>{incompleteCode}</pre>

                    <div className="mt-4">
                        <h4 className="font-semibold text-lg">Input Values</h4>
                        {predefinedValues.map((_, index) => (
                            <div key={index} className="mt-2">
                                <label>Value {index + 1}: </label>
                                <input
                                    type="text"
                                    value={inputValues[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                        ))}
                    </div>

                    <button onClick={handleSubmit}  className={`mt-4 px-6 py-2 rounded-md text-white ${subtime ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
                        disabled={subtime}
                    >
                        Submit
                    </button>

                    <div className='flex space-x-10'>
                        {resultMessage && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Result</h4>
                                <p>{resultMessage}</p>
                            </div>
                        )}
                        
                    </div>

                </div>
            </div>
        </div>
    );
};



const Round3 = () => {
    const [userOutput, setUserOutput] = useState('');
    const [submissionTime, setSubmissionTime] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Complex emoji-based code snippet
    const emojiCode = `
🔢 = 12345  
🔡 = 0  
🔁(🔢 > 0) {  
    📍 = 🔢 % 10  
    🔢 ➗= 10  
    🤔(📍 ⚖️ 6) 👉 🔡 ➕= 5  
    🤔(📍 ⚖️ 5) 👉 🔡 ➕= 4  
    🤔(📍 ⚖️ 4) 👉 🔡 ➕= 3  
    🤔(📍 ⚖️ 3) 👉 🔡 ➕= 2  
}  
🤔(🔡 > 15) 👉 ✍️("Greater") ❌ ✍️("Smaller")  
    `;

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/outputverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userOutput }),
            });

            const result = await response.json();
            if (result.success) {
                const currentTime = new Date().toLocaleTimeString();
                setSubmissionTime(currentTime);
                setIsSubmitted(true);
                setMessage('✅ Success! Your output is correct.');
            } else {
                setMessage('❌ Incorrect output. Please enter the correct answer.');
            }
        } catch (error) {
            console.error('Error verifying output:', error);
            setMessage('⚠️ Error occurred. Please try again later.');
        }
    };

    return (
        <div className="flex justify-start p-6"> {/* Add flex and justify-start for left alignment */}
            <div className="w-1/2"> {/* Set width to half the container */}
                <h2 className="text-2xl font-semibold mb-4">Round 3: Code Unravel</h2>

                {/* Display submission time if available */}
                {submissionTime && (
                    <div className="mb-4 text-lg font-bold text-green-600">
                        Submission Time: {submissionTime}
                    </div>
                )}

                <div className="bg-gray-100 p-4 rounded-md">
                    <p className="font-semibold text-lg">🔍 Analyze the Emoji Code:</p>
                    <pre className=" p-3 rounded-md mt-2">{emojiCode}</pre>
                

                {/* Output Input Field */}
                <div className="mt-4">
                    <label className="block font-semibold">Enter the exact output:</label>
                    <input
                        type="text"
                        value={userOutput}
                        onChange={(e) => setUserOutput(e.target.value)}
                        className=" p-2 mt-2 border rounded-md"
                        disabled={isSubmitted}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className={`mt-5 mb-7 px-6 py-2 rounded-md text-white ${isSubmitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
                    disabled={isSubmitted}
                >
                    Submit
                </button>
                </div>
                {/* Display Message */}
                {message && <p className="mt-4 font-semibold text-lg">{message}</p>}
            </div>
        </div>
    );
};



// Main Events Component
const Events = () => {
    const [selectedRound, setSelectedRound] = useState(1);

    const showRound1 = () => setSelectedRound(1);
    const showRound2 = () => setSelectedRound(2);
    const showRound3 = () => setSelectedRound(3);

    return (
        <div>
            <Navbar />
            <div className="flex justify-center space-x-6 mt-5">
                <button
                    onClick={showRound1}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                        ${selectedRound === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                >
                    Round 1
                </button>

                <button
                    onClick={showRound2}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                        ${selectedRound === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                >
                    Round 2
                </button>

                <button
                    onClick={showRound3}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                        ${selectedRound === 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                >
                    Round 3
                </button>
            </div>

            <div className="mt-10">
                {selectedRound === 1 && <Round1 />}
                {selectedRound === 2 && <Round2 />}
                {selectedRound === 3 && <Round3 />}
            </div>
        </div>
    );
};

export default Events;
