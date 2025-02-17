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
📌 mystory_one(🔢) {  
    🎈 = 0;  
    🔁(🔢 ▶️ 0) 
    {  
      🎈 = 🎈 * 10 ➕ (🔢 % 10);  
       🔢 /= 10; 
    }  
    ↩️ 🎈 ;  
}
📌 mystory_two(🔢) {  
    📜 = 0; 
    🔁(🔢 ▶️ 0) {  
        🔤 = 🔢 % 10;  
        📜 ➕= 🔤 * 🔤; 
        🔢 /= 10;  
    }  
    ↩️ 📜;   
}
📌 mystory_final(🔢) {  
    🔑 = mystory_one(🔢);  
    ↩️ mystory_two(🔑);  
}

✍️ Mystory_final(🔢)

            `,
            exampleTestCases: [
                { input: "123", output: "14" },
                { input: "103", output: "10" },
            ],
            Input: "123",
            testCases: [
                { input: "123", expectedOutput: "14" },
                { input: "103", expectedOutput: "10" },
                { input: "789", expectedOutput: "194" },
                { input: "100", expectedOutput: "1" },
            ]
        },
        3: {
            Emojicode: `
    📌 mystory_one(🔢, 🎁) {  
    🎁 [0] = 0, 
    🎁 [1] = 1;  
    🔁 (🔤 = 2; 🔤 ▶️ 🔢; 🔤⏩)  
        🎁 [🔤] = 🎁 [🔤 ➖ 1] ➕ 🎁 [🔤 ➖ 2];  
}

📌 mystory_two(🔢) {  
    🎁 [🔢];  
    mystory_one(🔢, 🎁);  

    🍬 ,📍 = 0;  
    🔁 (🔤 = 0 ; 🔤 ▶️ 🔢; 🔤⏩) {  
        🤔 (🎁 [🔤] % 2 🟰 0) 👉 
            📍 ➕= 🎁 [🔤];  
        ❌  
            🍬 ➕= 🎁 [🔤];  
    }  
    ↩️  🍬 ➖ 📍 ;   
}

📌 mystory_final(🔢) {  
    🍟= mystory_two(🔢)
    ↩️ 🍟;
    
}
✍️ Mystory_final(🔢)

            `,
            exampleTestCases: [
                { input: "5", output: "3" },
                { input: "6", output: "8" },
            ],
            Input: "5",
            testCases: [
                { input: "5", expectedOutput: "3" },
                { input: "6", expectedOutput: "8" },
                { input: "7", expectedOutput: "0" },
                { input: "8", expectedOutput: "13" },
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

    const location = useLocation();

    const participant = location.state?.participant || {}; // Ensure it's an object
    const randomNumber = participant.randomnumber || 1;

    const [userOutput, setUserOutput] = useState('');
    const [submissionTime, setSubmissionTime] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hintNumber, setHintNumber] = useState(null);

    const [hint, setHint] = useState(""); // Track the revealed hint
    const [displayhint, setdisplayHint] = useState(""); 
    const [points, setPoints] = useState(participant.points); // Track points
    const [hint1Revealed, setHint1Revealed] = useState(false);
    const [hint2Revealed, setHint2Revealed] = useState(false);
    const [hint3Revealed, setHint3Revealed] = useState(false);

    const [mathQuestion, setMathQuestion] = useState("");
    const [mathAnswer, setMathAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [isAnswerCorrect2, setIsAnswerCorrect2] = useState(null);



    const mathQuestions = {
        1: { question: "What is (15 × 2) + (30 ÷ 5)?", answer: 36 },
        2: { question: "What is (8 × 9) - (25 ÷ 5)?", answer: 67 },
        3: { question: "What is (20 ÷ 4) + (6 × 3)?", answer: 23 },
        4: { question: "What is (12 × 3) - (8 ÷ 4)?", answer: 34 },
        5: { question: "What is (50 ÷ 5) + (9 × 4)?", answer: 46 }
    };

    const logicPuzzles = {
        1: { question: "What comes next in this sequence? 3, 6, 11, 18, 27, _?", answer: 38 },
        // Pattern: n = previous + (increasing odd numbers: 3, 5, 7, 9, 11)

        2: { question: "What is the missing number? 2, 4, 8, 16, _?", answer: 32 },
        // Pattern: Each number is multiplied by 2.

        3: { question: "Find the next number: 1, 1, 2, 3, 5, _?", answer: 8 },
        // Fibonacci series: n = (n-1) + (n-2)

        4: { question: "What comes next? 10, 20, 30, 50, 80, _?", answer: 130 },
        // Pattern: Sum of previous two numbers (10+20=30, 20+30=50, etc.)

        5: { question: "Identify the missing number: 100, 96, 92, 88, _?", answer: 84 }
        // Pattern: Decreasing by 4 each time.
    };

    const generateMathQuestion = () => {
        const randomIndex = Math.floor(Math.random() * 5) + 1; // Generate a random number between 1 and 5
        const { question, answer } = mathQuestions[randomIndex]; // Get the corresponding question and answer

        setMathQuestion(question);
        setMathAnswer(answer);
    };
    const generalKnowledgeQuestions = {
        1: { question: "Which planet is known as the Red Planet?", answer: "Mars" },
        2: { question: "How many continents are there on Earth?", answer: "Seven" },
        3: { question: "Which is the largest ocean on Earth?", answer: "Pacific" },
        4: { question: "Who wrote India's national anthem?", answer: "Tagore" },
        5: { question: "What is the capital of Japan?", answer: "Tokyo" },
        6: { question: "Which is the smallest country?", answer: "Vatican" },
        7: { question: "How many colors are in a rainbow?", answer: "Seven" },
        8: { question: "Who was first to walk on the moon?", answer: "Armstrong" },
        9: { question: "What is India's national sport?", answer: "Hockey" },
        10: { question: "Which is the longest river?", answer: "Nile" }
    };


    const verifyAnswer = () => {
        let isCorrect = false;
        if (hintNumber === 3) {
            // Convert both user input and answer to lowercase and trim spaces for comparison
            isCorrect = userAnswer.trim().toLowerCase() === mathAnswer.toLowerCase();
        } else {
            // Compare as numbers for Hint 1 and Hint 2
            isCorrect = parseInt(userAnswer) === mathAnswer;
        }
    
        if (isCorrect) {
            switch (hintNumber) {
                case 1:
                    setdisplayHint("✅ Correct! Hint 1: 'Think about breaking it down into smaller parts...'");
                    break;
                case 2:
                    setdisplayHint("✅ Correct! Hint 2: 'Try approaching it from a different perspective...'");
                    setIsAnswerCorrect2(true);
                    break;
                case 3:
                    setdisplayHint("✅ Correct! Hint 3: 'Use logical reasoning to find the best solution!'");
                    break;
                default:
                    setdisplayHint("✅ Correct! Great job!");
            }
            setIsAnswerCorrect(true);
        } else {
            setHint("❌ Wrong answer! Try again.");
            setIsAnswerCorrect(false);
        }
    };
    
    const generateLogicPuzzle = () => {
        const randomIndex = Math.floor(Math.random() * 5) + 1; // Generate a number between 1 and 5
        const selectedPuzzle = logicPuzzles[randomIndex]; // Get the corresponding puzzle

        setMathQuestion(selectedPuzzle.question);
        setMathAnswer(selectedPuzzle.answer);
    };

    const generateGeneralKnowledgeQuestion = () => {
        const randomNumber = Math.floor(Math.random() * Object.keys(generalKnowledgeQuestions).length) + 1;
        const selectedQuestion = generalKnowledgeQuestions[randomNumber];
    
        setMathQuestion(selectedQuestion.question);
        setMathAnswer(selectedQuestion.answer);
    };
    
    const revealHint = async (hintnumber) => {
        if (hintnumber === 1) {
            setHint("🔍 Solve this to reveal Hint 1:");
            generateMathQuestion(); // Generate a math question

            try {
                const response = await fetch(`http://localhost:5000/getpoints?email=${encodeURIComponent(participant.email)}&hintnumber=${hintnumber}`);
        
                const data = await response.json();
        
                if (response.ok) {
                    if (data.points !== undefined) {
                        setPoints(data.points); // Update the points state
                    }
                } else {
                    console.error("Error fetching points:", data.message);
                }
            } catch (error) {
                console.error("Error fetching points:", error);
            }

            setHint1Revealed(true);
            setHintNumber(1);
        } else if (hintnumber === 2) {
            generateLogicPuzzle();
            try {
                const response = await fetch(`http://localhost:5000/getpoints?email=${encodeURIComponent(participant.email)}&hintnumber=${hintnumber}`);
        
                const data = await response.json();
        
                if (response.ok) {
                    if (data.points !== undefined) {
                        setPoints(data.points); // Update the points state
                    }
                } else {
                    console.error("Error fetching points:", data.message);
                }
            } catch (error) {
                console.error("Error fetching points:", error);
            }
            setHint("🔍 Hint 2 is revealed! Solve the pattern puzzle.");
            setHint2Revealed(true);
            setHintNumber(2);
            setUserAnswer(""); // Clear the input box
        } else if (hintnumber === 3) {
            generateGeneralKnowledgeQuestion();
            try {
                const response = await fetch(`http://localhost:5000/getpoints?email=${encodeURIComponent(participant.email)}&hintnumber=${hintnumber}`);
        
                const data = await response.json();
        
                if (response.ok) {
                    if (data.points !== undefined) {
                        setPoints(data.points); // Update the points state
                    }
                } else {
                    console.error("Error fetching points:", data.message);
                }
            } catch (error) {
                console.error("Error fetching points:", error);
            }
            setHint("🔍 Hint 3 is revealed!");
            setHint3Revealed(true);
            setHintNumber(3);
            setUserAnswer("");
        }

    };
    // Complex emoji-based code snippet


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

        <div className="flex justify-between p-10 space-x-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
    {/* Left Side: Main Code Section */}
    <div className="w-1/2">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                🚀 Round 3: <span className="text-blue-600 ml-2">Code Unravel</span>
            </h2>
            <p className="text-xl font-semibold text-gray-700">🔍 Analyze the Emoji Code:</p>
            <pre className="bg-gray-100 p-5 rounded-lg mt-4 text-gray-900 font-mono border border-gray-300 shadow-sm">
                {emojiCode}
            </pre>

            {/* Output Input Field */}
            <div className="mt-6">
                <label className="block font-semibold text-gray-700 text-lg">Enter the exact output:</label>
                <input
                    type="text"
                    value={userOutput}
                    onChange={(e) => setUserOutput(e.target.value)}
                    className="w-full p-3 mt-3 border-2 border-gray-300 rounded-xl focus:ring focus:ring-blue-400 shadow-sm"
                    disabled={isSubmitted}
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className={`mt-6 px-6 py-3 text-lg font-bold rounded-xl transition duration-300 ${
                    isSubmitted ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                }`}
                disabled={isSubmitted}
            >
                ✅ Submit
            </button>

            {/* Display Message */}
            {message && <p className="mt-5 text-lg font-semibold text-green-600">{message}</p>}
        </div>
    </div>

    {/* Right Side: Hint System */}
    <div className="w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Points Display */}
        <div className="text-xl flex justify-end items-center font-extrabold text-gray-900 mb-6">
            🏆 Points: <span className="text-blue-600 ml-2">{points}</span>
        </div>

        {/* Hint Buttons */}
        <div className="flex justify-end space-x-4">
            <button
                onClick={() => revealHint(1)}
                className={`px-5 py-3 text-lg font-bold rounded-xl transition duration-300 ${
                    hint1Revealed ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                }`}
                disabled={hint1Revealed}
            >
                💡 Hint 1
            </button>
            <button
                onClick={() => revealHint(2)}
                className={`px-5 py-3 text-lg font-bold rounded-xl transition duration-300 ${
                    hint2Revealed || !isAnswerCorrect ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                }`}
                disabled={hint2Revealed || !isAnswerCorrect}
            >
                🧩 Hint 2
            </button>
            <button
                onClick={() => revealHint(3)}
                className={`px-5 py-3 text-lg font-bold rounded-xl transition duration-300 ${
                    hint3Revealed || !isAnswerCorrect2 ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600 text-white shadow-md"
                }`}
                disabled={hint3Revealed || !isAnswerCorrect2}
            >
                🔥 Hint 3
            </button>
        </div>

        {/* Display the Revealed Hint */}
        {hint1Revealed && (
            <div className="mt-6 p-5 bg-gray-100 rounded-lg shadow-md border border-gray-300">
                <p className="text-lg font-semibold text-gray-800">{hint}</p>
                <div className="mt-4">
                    <p className="font-semibold text-gray-700">{mathQuestion}</p>
                    <input
                        type={hintNumber === 3 ? "text" : "number"} 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-xl mt-3 focus:ring focus:ring-blue-400"
                    />

                    <button
                        onClick={verifyAnswer}
                        className="mt-4 px-5 py-3 text-lg font-bold rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md transition duration-300"
                    >
                        ✅ Verify
                    </button>
                </div>
                <p className="mt-4 font-semibold text-gray-700">{displayhint}</p>
            </div>
        )}
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
                        ${selectedRound === 2 && allPassed2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                    disabled={!allPassed2} // Disable button until Round 1 is passed
                >
                    Round 2
                </button>

                <button
                    onClick={showRound3}
                    className={`px-6 py-2 text-lg font-medium transition duration-300 
                        ${selectedRound === 3 && allPassed ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                    disabled={!allPassed} // Disable button until Round 2 is passed
                >
                    Round 3
                </button>
            </div>

            <div className="mt-10">
                {selectedRound === 1 && <Round2 setAllPassed2={setAllPassed2} />}
                {selectedRound === 2 && allPassed2 && <Round1 setAllPassed={setAllPassed} />}
                {selectedRound === 3  && <Round3 />}
            </div>
        </div>
    );
};

export default Events;