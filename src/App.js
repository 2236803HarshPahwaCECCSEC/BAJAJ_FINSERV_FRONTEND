import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

function App() {
    const [input, setInput] = useState("");
    const [resData, setResData] = useState(null);
    const [err, setErr] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);

    const backendUrl = "https://bajaj-5jvx.onrender.com/bhfl";

    const options = [
        { value: "alphabets", label: "Alphabets" },
        { value: "numbers", label: "Numbers" },
        { value: "highest_alphabet", label: "Highest Alphabet" },
    ];

    const handleSubmit = async () => {
        try {
            const trimmedInput = input.trim();
            if (!trimmedInput.startsWith("{") || !trimmedInput.endsWith("}")) {
                throw new Error("Invalid JSON format");
            }
            const jsonParsed = JSON.parse(trimmedInput);
            if (!jsonParsed.data || !Array.isArray(jsonParsed.data)) {
                throw new Error("JSON must have 'data' as an array");
            }
            const response = await axios.post(backendUrl, jsonParsed);
            setResData(response.data);
            setErr("");
        } catch (error) {
            console.error("Parsing error:", error);
            setErr("Invalid JSON format");
            setResData(null);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2 style={{ textAlign: "left", marginLeft: "30px" }}>2236803_challenge</h2>
            <textarea
                rows="4"
                cols="50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Enter JSON (e.g. {"data":["A","1","B","3"]})'
            />
            <br />
            <button
                onClick={handleSubmit}
                style={{
                    backgroundColor: "#1565c0",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "10px",
                }}
            >
                Submit
            </button>

            {err && <p style={{ color: "red" }}>{err}</p>}

            {resData && (
                <div style={{ textAlign: "left", marginTop: "20px", marginLeft: "30px" }}>
                    <h3>Multi Filter</h3>
                    <Select
                        isMulti
                        options={options}
                        onChange={(selected) => setSelectedFilters(selected.map(opt => opt.value))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />

                    <h3>Filtered Response</h3>
                    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
                        {JSON.stringify(
                            Object.fromEntries(
                                Object.entries(resData).filter(([key]) =>
                                    key === "user_id" ||
                                    key === "email" ||
                                    key === "roll_number" ||
                                    selectedFilters.includes(key)
                                )
                            ),
                            null,
                            2
                        )}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;
