"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            <Stack spacing={2}>
              <Typography variant="subtitle1">Skills</Typography>
              {skills.map((skill, index) => (
                <Stack direction="row" spacing={1} key={index} alignItems="center">
                  <TextField
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    fullWidth
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeSkill(index)}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addSkill}
              >
                Add Skill
              </Button>
            </Stack>

            <Button type="submit" variant="contained" color="primary">
              Save Profile
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default NewProfilePage;
