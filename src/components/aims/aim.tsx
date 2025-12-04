import React, { useState } from "react";

interface AimProps {
  onDataChange: (data: { aim: string }) => void;
}

const Aim: React.FC<AimProps> = ({ onDataChange }) => {
  const [aim, setAim] = useState("");

  const handleChange = (value: string) => {
    setAim(value);
    onDataChange({ aim: value });
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-center mb-4">AIM</h2>

      <textarea
        className="w-full border p-2 mb-4 rounded h-32 leading-relaxed"
        value={aim}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter AIM paragraph..."
      />
    </div>
  );
};

export default Aim;
