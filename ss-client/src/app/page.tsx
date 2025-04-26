"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  _id: string;
  name: string;
  skills: string[];
}

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; skills: string }>({
    name: "",
    skills: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const fetchProfiles = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json();
      setProfiles(data);
    };
    fetchProfiles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!token) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setProfiles(profiles.filter((profile) => profile._id !== id));
    } else {
      alert("Failed to delete profile");
    }
  };

  const handleEdit = (profile: Profile) => {
    if (!token) return;

    setEditingId(profile._id);
    setEditData({ name: profile.name, skills: profile.skills.join(", ") });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editData.name,
            skills: editData.skills.split(",").map((skill) => skill.trim()),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updated = await response.json();

      setProfiles(profiles.map((p) => (p._id === editingId ? updated : p)));
      setEditingId(null);
    } catch (err) {
      alert("Error editing profile");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-2 md:p-4">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-4xl font-bold">
          Skill<span className="text-blue-600">Social</span>
        </h1>
        <div className="flex flex-col items-end">
          {!token ? (
            <Link href="/auth">
              <button className="bg-blue-600 text-white px-2 py-1 mb-2 rounded cursor-pointer">Sign in</button>
            </Link>
          ) : (
            <button className="border-1 border-red-600 text-red-600 px-2 py-1 mb-2 rounded cursor-pointer" onClick={handleSignOut}>Sign out</button>
          )}
          <Link href="/new">
            <p className="text-green-600 hover:underline">+ Add Profile</p>
          </Link>
        </div>
      </div>

      {profiles.length === 0 ? (
        <p className="text-gray-500">No profiles yet.</p>
      ) : !editingId ? (
        <ul className="space-y-4">
          {profiles.map((profile) => (
            <li key={profile._id} className="border rounded-md p-4">
              <>
                <h3 className="font-bold text-xl">{profile.name}</h3>
                <ul className="list-disc list-inside text-sm text-gray-400">
                  <p>skills:</p>
                  {profile.skills.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </>
              {token ? (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDelete(profile._id)}
                    className="text-red-600 border-1 border-red-600 rounded-sm px-2 cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(profile)}
                    className="text-blue-600 border-1 border-blue-600 rounded-sm px-2 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <></>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <label>Name:</label>
          <input
            className="border p-2 w-full mb-4"
            name="name"
            value={editData.name}
            onChange={handleEditChange}
          />
          <label>Skills: (comma-separated)</label>
          <input
            className="border p-2 w-full"
            name="skills"
            value={editData.skills}
            onChange={handleEditChange}
            placeholder="Comma-separated skills"
          />
          <div className="flex flex-row gap-2 my-4">
            <button
              onClick={handleEditSubmit}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="bg-gray-300 text-black px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilesPage;
