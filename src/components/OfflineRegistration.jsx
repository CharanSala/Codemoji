import React, { useState } from "react";

const OfflineRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [message, setMessage] = useState(""); // To display success/error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://codemojibackend.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Registration Successful!");
        setFormData({ name: "", email: "" }); // Reset form
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("❌ Server Error. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Offline Registration</h2>
      {message && (
  <p className={`mb-2 ${message.startsWith("❌") ? "text-red-500" : "text-green-500"}`}>
    {message}
  </p>
)}
 {/* Show messages */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OfflineRegistration;
