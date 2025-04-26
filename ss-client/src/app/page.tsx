"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import { Add, Delete, Edit, ChevronRight } from "@mui/icons-material";

interface Profile {
  _id: string;
  name: string;
  skills: string[];
}

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; skills: string[] }>({
    name: "",
    skills: [],
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    setEditData({ name: profile.name, skills: profile.skills });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...editData.skills];
    updatedSkills[index] = value;
    setEditData({ ...editData, skills: updatedSkills });
  };

  const handleAddSkill = () => {
    setEditData({ ...editData, skills: [...editData.skills, ""] });
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...editData.skills];
    updatedSkills.splice(index, 1);
    setEditData({ ...editData, skills: updatedSkills });
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
            skills: editData.skills.map((skill) => skill.trim()),
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

  const filteredProfiles = profiles.filter((profile) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = profile.name.toLowerCase().includes(query);
    const skillsMatch = profile.skills.some((skill) =>
      skill.toLowerCase().includes(query)
    );
    return nameMatch || skillsMatch;
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">
            Skill<span style={{ color: "#1976d2" }}>Social</span>
          </Typography>
          <Stack direction="row" spacing={2}>
            {!token ? (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/auth"
              >
                Sign in
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={handleSignOut}>
                Sign out
              </Button>
            )}
            <Button
              startIcon={<Add />}
              variant="outlined"
              component={Link}
              href="/new"
            >
              Add Profile
            </Button>
          </Stack>
        </Stack>

        <TextField
          fullWidth
          variant="outlined"
          label="Search by name or skill"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {profiles.length === 0 ? (
          <Typography color="text.secondary">No profiles yet.</Typography>
        ) : !editingId ? (
          <List>
            {filteredProfiles.map((profile) => (
              <ListItem key={profile._id} sx={{ mb: 2 }} component={Paper}>
                <Stack sx={{ width: "100%" }} spacing={1}>
                  <Typography variant="h6">{profile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Skills:
                  </Typography>
                  <List dense>
                    {profile.skills.map((skill, idx) => (
                      <ListItem key={idx} sx={{ pl: 2 }}>
                        <ChevronRight /><ListItemText primary={skill} />
                      </ListItem>
                    ))}
                  </List>
                  {token && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<Delete />}
                        color="error"
                        onClick={() => handleDelete(profile._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        startIcon={<Edit />}
                        color="primary"
                        onClick={() => handleEdit(profile)}
                      >
                        Edit
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>
        ) : (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
            />
            {editData.skills.map((skill, idx) => (
              <Stack direction="row" spacing={1} key={idx}>
                <TextField
                  fullWidth
                  label={`Skill ${idx + 1}`}
                  value={skill}
                  onChange={(e) => handleSkillChange(idx, e.target.value)}
                />
                <Button color="error" onClick={() => handleRemoveSkill(idx)}>
                  ✕
                </Button>
              </Stack>
            ))}
            <Button variant="outlined" onClick={handleAddSkill}>
              + Add Skill
            </Button>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                onClick={handleEditSubmit}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default ProfilesPage;
