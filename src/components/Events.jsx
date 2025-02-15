import React, { useState, useEffect } from "react";

import Navbar from './Navbar';  // Assuming you have Navbar component
import MonacoEditor from '@monaco-editor/react';  // Monaco editor for code writing
import { useLocation } from "react-router-dom";


// Round 1 Component
const Round1 = ({ setAllPassed }) => {


    const location = useLocation();

    const participant = location.state?.participant || {}; // Ensure it's an object
    const randomNumber = participant.randomnumber || 1;

    console.log("participant", participant);
    console.log("Participant Data:", participant.name);
    console.log("Participant Data:", participant.round1submissiontime);

    const problemSets = {
        1: {
            Emojicode: `
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
            `,

            exampleTestCases: [
                { input: "10", output: "20" },
                { input: "20", output: "40" },
            ],
            Input: "10",
            testCases: [
                { input: "10", expectedOutput: "20" },
                { input: "20", expectedOutput: "40" },
                { input: "30", expectedOutput: "60" },
                { input: "70", expectedOutput: "140" },
                { input: "120", expectedOutput: "240" },
            ]
        },
        2: {
            Emojicode: `
    🔢 = 246810  
    🔡 = 🔢 * 2  
    🔁(🔡 📏 > 1) {  
        📜 = 🔡 / 2  
        ✍️(📜)  
    }
            `,
            exampleTestCases: [
                { input: "5", output: "10" },
                { input: "6", output: "12" },
            ],
            Input: "5",
            testCases: [
                { input: "5", expectedOutput: "10" },
                { input: "6", expectedOutput: "12" },
            ]
        },
        3: {
            Emojicode: `
    🔢 = 3579  
    🔡 = [🔢]  
    🔁(🔢 > 0) {  
        📜 = 🔢 % 10  
        🤔(📜 ⚖️ 3) 👉 🔡 ➕= 📜  
        🔢 ➗= 10  
    }
    ✍️(🔡)
            `,
            exampleTestCases: [
                { input: "3", output: "9" },
                { input: "5", output: "15" },
            ],
            Input: "3",
            testCases: [
                { input: "3", expectedOutput: "9" },
                { input: "5", expectedOutput: "15" },
            ]
        },
        4: {
            Emojicode: `
    🔢 = 1001  
    🔡 = 0  
    🔁(🔢 > 0) {  
        📜 = 🔢 % 10  
        🤔(📜 ⚖️ 1) 👉 🔡 ➕= 📜  
        🔢 ➗= 10  
    }
    ✍️(🔡)
            `,
            exampleTestCases: [
                { input: "101", output: "2" },
                { input: "111", output: "3" },
            ],
            Input: "101",
            testCases: [
                { input: "101", expectedOutput: "2" },
                { input: "111", expectedOutput: "3" },
            ]
        },
        5: {
            Emojicode: `
    🔢 = 9  
    🔡 = 🔢 ** 2  
    ✍️(🔡)
            `,
            exampleTestCases: [
                { input: "2", output: "4" },
                { input: "3", output: "9" },
            ],
            Input: "2",
            testCases: [
                { input: "2", expectedOutput: "4" },
                { input: "3", expectedOutput: "9" },
            ]
        }
    };

    const [selectedLanguage, setSelectedLanguage] = useState(
        participant?.language && participant.language.trim() !== "" ? participant.language : "c"
    );

    useEffect(() => {
        const fetchlanguage = async () => {
            if (!participant.email) return; // Ensure email exists before making request

            try {
                const response = await fetch(`http://localhost:5000/getlanguage?email=${encodeURIComponent(participant.email)}`);
                const data = await response.json();

                if (response.ok) {
                    if (data.language)
                        setSelectedLanguage(data.language); // Set the submitted code if available
                } else {
                    console.error("Error fetching code:", data.message);
                }
            } catch (error) {
                console.error("Error fetching code:", error);
            }
        };

        fetchlanguage();
    }, [participant.email]);


    const [code, setCode] = useState(participant?.submittedCode || "");

    useEffect(() => {
        const fetchCode = async () => {
            if (!participant.email) return; // Ensure email exists before making request

            try {
                const response = await fetch(`http://localhost:5000/getsubmittedcode?email=${encodeURIComponent(participant.email)}`);
                const data = await response.json();

                if (response.ok) {
                    setCode(data.submittedCode || ""); // Set the submitted code if available
                } else {
                    console.error("Error fetching code:", data.message);
                }
            } catch (error) {
                console.error("Error fetching code:", error);
            }
        };

        fetchCode();
    }, [participant.email]);



    const [output, setOutput] = useState("");
    const [testResults, setTestResults] = useState({
        failedCount: 0,
        oneFailedTest: [],
        satisfiedTestCases: [],
    });

    const [withInput, setWithInput] = useState(true);
    const [Round1sub, setRound1Time] = useState(participant.round1submissiontime || "");

    useEffect(() => {
        const fetchTime = async () => {
            if (!participant.email) return; // Ensure email exists before making request

            try {
                const response = await fetch(`http://localhost:5000/getsubmissiontime?email=${encodeURIComponent(participant.email)}`);
                const data = await response.json();

                if (response.ok) {
                    setRound1Time(data.subtime || ""); // Set the submitted code if available

                } else {
                    console.error("Error fetching code:", data.message);
                }
            } catch (error) {
                console.error("Error fetching code:", error);
            }
        };

        fetchTime();
    }, [participant.email]);


    useEffect(() => {
        if (Round1sub) {
            setAllPassed(true);  // If submission time exists, mark Round 1 as passed
        }
    }, [Round1sub]);

    const getRandomNumber = () => {
        return Math.floor(Math.random() * 5) + 1;
    };


    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };



    const { Emojicode, exampleTestCases = [], testCases = [], Input = "" } = problemSets[randomNumber] || problemSets[1] || {};

    const handleRunCode = async () => {
        try {
            const input = withInput ? Input : "";  // Only send input if 'withInput' is true

            const response = await fetch('http://localhost:5000/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: code,
                    action: "run",
                    withInput: withInput,
                    input: input  // Send input (empty if not with input)
                }),
            });

            const result = await response.json();
            setOutput(result.output || result.message);
        } catch (error) {
            setOutput('Error running the code: ' + error.message);
        }
    };


    const handleSubmit = async () => {
        // let allPassed = false;
        try {
            const response = await fetch('http://localhost:5000/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: code,
                    action: "submit",
                    testcases: testCases,
                }),
            });

            const result = await response.json();
            console.log(result.status);

            if (result.status === "success") {
                // Check test results to update 
                // the state
                setRound1Time(result.subtime);
                const passedTestCases = result.passedTestCases.map(tc => ({
                    input: tc.input,
                    expected: tc.expected,
                    got: tc.got,
                    status: "passed"
                })) || [];

                // Determine if all test cases passed

                console.log("charan", passedTestCases);

                // Update test results
                setTestResults({
                    failedCount: 0,
                    oneFailedTest: null,
                    satisfiedTestCases: [passedTestCases[0], passedTestCases[1]],
                });




            } else {
                if (result.failedTestCases.length > 0) {
                    let failedCount = result.failedTestCases.length;
                    let oneFailedTest = result.failedTestCases[0];

                    let passedTestCases = result.passedTestCases?.map(tc => ({
                        input: tc.input,
                        expected: tc.expected,
                        got: tc.got,
                        status: "passed"
                    })) || [];

                    setTestResults({
                        failedCount,
                        oneFailedTest: {
                            input: oneFailedTest.input,
                            expected: oneFailedTest.expected,
                            got: oneFailedTest.got,
                            status: "failed"
                        },
                        satisfiedTestCases: passedTestCases,
                    });
                } else if (result.error) {
                    setTestResults({
                        failedCount: 0,
                        oneFailedTest: {
                            input: "N/A",
                            expected: "N/A",
                            got: result.error,
                            status: "error"
                        },
                        satisfiedTestCases: [],
                    });
                }
            }
        } catch (error) {
            setTestResults({
                failedCount: 0,
                oneFailedTest: {
                    input: "N/A",
                    expected: "N/A",
                    got: `Error running the code: ${error.message}`,
                    status: "error"
                },
                satisfiedTestCases: [],
            });
        }

        // setAllPassed(allPassed);
        console.log(testCases)
    };
    const languages = ["python", "cpp", "c", "java"];

    return (
        <div className="flex justify-between p-6 space-x-3">
            <div className="w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Emoji Code</h3>
                {Round1sub && (
                    <h3 className="text-green-500 font-bold text-lg mb-5">
                        Submission Time: {Round1sub}
                    </h3>
                )}

                <div className="bg-gray-100 p-4 rounded-md">
                    <p>🎯 <strong>Task:</strong> Convert this emoji-based code into a valid program.</p>
                    <pre>{Emojicode}</pre>
                    <div className="">
                        <h4 className="font-semibold text-lg">Test Cases</h4>
                        {exampleTestCases.map((testCase, index) => (
                            <div
                                key={index}
                                className={`mt-2 p-2 rounded-md ${index === 0 ? 'text-red-700' : 'bg-gray-100'}`}
                            >
                                {index === 0 && <p className="font-bold text-yellow-700">🔰 Initial Predefined Input</p>}
                                <p><strong>Input:</strong> {testCase.input}</p>
                                <p><strong>Output:</strong> {testCase.output}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className="w-1/2">
                <h3 className="text-2xl font-semibold mb-4">Write Your Code</h3>

                <div className="mb-4 flex items-center space-x-4">

                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value={selectedLanguage}>{selectedLanguage}</option>
                        {languages
                            .filter((lang) => lang !== selectedLanguage) // Exclude the selected language
                            .map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)} {/* Capitalize first letter */}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={!withInput}
                            onChange={() => setWithInput(!withInput)}
                            className="mr-2"
                        />
                        <span>Run without input</span>
                    </label>
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
                    disabled={Round1sub} // Disables button when Round1sub has a value
                    className={`mt-4 px-8 ml-3 py-2 rounded-md ${Round1sub ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
                        }`}
                >
                    Submit
                </button>



                <div className="mt-4">
                    <h4 className="text-lg font-semibold">Output</h4>
                    <pre className="bg-gray-100 p-4 rounded-md">{output || 'No output yet.'}</pre>
                </div>

                <div className="mt-4">
                    <h4 className="text-lg font-semibold">Test Case Results</h4>
                    <ul>
                        {console.log(testResults)}
                        {testResults.failedCount === 0 && testResults.satisfiedTestCases.length > 0 ? (
                            // ✅ All test cases passed
                            <>
                                <li className="text-green-600">
                                    <strong>✅ All Test Cases Passed!</strong>
                                </li>
                                {testResults.satisfiedTestCases.map((tc, index) => (
                                    <li key={index} className="text-green-600">
                                        <strong>Input:</strong> {tc.input} <br />
                                        <strong>Expected:</strong> {tc.expected} <br />
                                        <strong>Got:</strong> {tc.got} <br />
                                        <strong>Status:</strong> ✅ Success
                                    </li>
                                ))}
                            </>
                        ) : (
                            // ❌ Some test cases failed
                            <>

                                {testResults.satisfiedTestCases?.length > 0 && (
                                    <>
                                        <li className="text-green-600">
                                            <strong>✅ Passed Test Cases: {testResults.satisfiedTestCases.length}</strong>
                                        </li>
                                    </>
                                )}
                                {testResults.failedCount > 0 && (
                                    <li className="text-red-600">
                                        <strong>❌ Failed Test Cases:</strong> {testResults.failedCount}
                                    </li>
                                )}

                                {/* {testResults.oneFailedTest && testResults.failedCount > 0 && (
                                    <li className="text-red-600">
                                        <strong>❌ One Failed Test Case:</strong> <br />
                                        <strong>Input:</strong> {testResults.oneFailedTest.input} <br />
                                        <strong>Expected:</strong> {testResults.oneFailedTest.expected} <br />
                                        <strong>Got:</strong> {testResults.oneFailedTest.got} <br />
                                        <strong>Status:</strong> ❌ Failed
                                    </li>
                                )} */}

                                {/* Only show passed test cases if they exist */}

                            </>
                        )}
                    </ul>



                </div>

            </div>
        </div>
    );
};

// Round 2 Component (your new round)
const Round2 = ({ setAllPassed2 }) => {
    const incompleteCode = `
            📌 fact(🔢) {
        🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
            ↩️ 🔢 ✖️ fact(🔢 ➖ 1)
    }
            `;


    const location = useLocation();
    const participant = location.state?.participant; // Get participant object
    const randomNumber = participant?.randomNumber || 1;

    const problemSets = {
        1: {
            Emojicode: `
            📌 fact(🔢, 💡) {
    🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
            🤔(💡 ⚖️ ❓) 👉 ↩️ 🔢 ✖️ fact(🔢 ➖ ❓, 💡 ➖ ❓)
            ↩️ 🔢 ✖️ fact(🔢 ➖ ❓, 💡 ➖ ❓)
}
            fact(5, 3)
            `,
            output: 120,
        },
        2: {
            Emojicode: `
            📌 sumPower(🔢, ⚡) {
    🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
            🤔(⚡ ⚖️ ❓) 👉 ↩️ 🔢 ** ⚡ ➕ sumPower(🔢 ➖ ❓, ⚡ ➖ ❓)
            ↩️ 🔢 ** ⚡ ➕ sumPower(🔢 ➖ ❓, ⚡ ➖ ❓)
}
            sumPower(4, 3)
            `,
            output: 364,
        },
        3: {
            Emojicode: `
            📌 calc(🔢, 💡, ⚡) {
    🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
            🤔(💡 ⚖️ ❓) 👉 ↩️ 🔢 ✖️ 💡 ➕ calc(🔢 ➖ ❓, 💡 ➕ ❓, ⚡ ➖ ❓)
            ↩️ 🔢 ✖️ 💡 ➕ calc(🔢 ➖ ❓, 💡 ➕ ❓, ⚡ ➖ ❓)
}
            calc(4, 2, 3)
            `,
            output: 40,
        },
        4: {
            Emojicode: `
            📌 expSum(🔢, ⚡, 💡) {
    🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
            🤔(⚡ ⚖️ ❓) 👉 ↩️ 🔢 ** ⚡ ➕ expSum(🔢 ➖ ❓, ⚡ ➕ ❓, 💡 ➖ ❓)
            ↩️ 🔢 ** ⚡ ➕ expSum(🔢 ➖ ❓, ⚡ ➕ ❓, 💡 ➖ ❓)
}
            expSum(3, 3, 2)
            `,
            output: 147,
        },
        5: {
            Emojicode: `
            📌 fibMulAdd(🔢, 💡, ⚡) {
    🤔(🔢 ⚖️ ❓) 👉 ↩️ ❓
            🤔(💡 ⚖️ ❓) 👉 ↩️ fibMulAdd(🔢 ➖ ❓, 💡 ➕ ❓, ⚡ ➖ ❓) ✖️ 2
            🤔(⚡ ⚖️ ❓) 👉 ↩️ fibMulAdd(🔢 ➖ ❓, 💡 ➕ ❓, ⚡ ➖ ❓) ➕ fibMulAdd(🔢 ➖ 1, 💡 ➕ 1, ⚡ ➖ 1)
            ↩️ fibMulAdd(🔢 ➖ ❓, 💡 ➕ 1, ⚡ ➖ ❓) ➕ fibMulAdd(🔢 ➖ 1, 💡 ➕ 1, ⚡ ➖ 1)
}
            fibMulAdd(7, 3, 5)
            `,
            output: 9,
        }
    };

    const { Emojicode, output } = problemSets[randomNumber] || problemSets[1];
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

            console.log(result)
            if (result.status) {
                setAllPassed2(true);
            } else {
                setAllPassed2(false); // Mark it as failed if not successful
            }

            setResultMessage(result.message);
            setSubtime(result.submissionTime);


        } catch (error) {
            console.error('Error:', error);
            setResultMessage('Error verifying inputs: ' + error.message);
            setAllPassed2(false);
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
                    <pre>{Emojicode}</pre>
                    <p className=''>Output:{output}</p>
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

                    <button onClick={handleSubmit} className={`mt-4 px-6 py-2 rounded-md text-white ${subtime ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
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
    const location = useLocation();
    const participant = location.state?.participant; // Get participant object

    const [selectedRound, setSelectedRound] = useState(1);
    const [allPassed, setAllPassed] = useState(false); // Track if Round 1 is passed
    const [allPassed2, setAllPassed2] = useState(false); // Track if Round 2 is passed

    useEffect(() => {
        console.log("useEffect triggered, allPassed:", allPassed);
        if (allPassed === true) {
            setSelectedRound(2);
        }
    }, [allPassed]);
    const showRound1 = () => setSelectedRound(1);
    const showRound2 = () => setSelectedRound(2);
    const showRound3 = () => setSelectedRound(3);

    return (
        <div>
            <Navbar />
            <div className="text-center mt-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome, <span className="text-blue-600">{participant?.name}</span>!
                </h1>
            </div>
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
                        ${selectedRound === 2 && allPassed ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                    disabled={!allPassed} // Disable button until Round 1 is passed
                >
                    Round 2
                </button>

                <button
                    onClick={showRound3}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                        ${selectedRound === 3 && allPassed2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                    disabled={!allPassed2} // Disable button until Round 2 is passed
                >
                    Round 3
                </button>
            </div>

            <div className="mt-10">
                {selectedRound === 1 && <Round1 setAllPassed={setAllPassed} />}
                {selectedRound === 2 && allPassed && <Round2 setAllPassed2={setAllPassed2} />}
                {selectedRound === 3 && allPassed2 && <Round3 />}
            </div>
        </div>
    );
};

export default Events;