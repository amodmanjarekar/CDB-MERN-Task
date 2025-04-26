"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NewProfilePage = () => {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([""]);
  const router = useRouter();

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile = {
      name: name.trim(),
      skills: skills.map((s) => s.trim()).filter(Boolean),
    };

    console.log(process.env.NEXT_PUBLIC_SERVER_URL);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      }
    );

    if (response.ok) {
      router.push("/");
    } else {
      console.error("Error saving profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Skills</label>
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="flex-grow border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addSkill} className="text-blue-500">
            + Add Skill
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default NewProfilePage;
