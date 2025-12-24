import { Roadmap } from "../models/Roadmap.js";

// CREATE ROADMAP
export const createRoadmap = async (req, res) => {
  try {
    const { title, steps, career, estimatedTime, resources, projects } = req.body;

    const roadmap = await Roadmap.create({
      title,
      steps,
      career, // Added to track the role
      estimatedTime,
      resources,
      projects,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Roadmap created", roadmap });

  } catch (error) {
    res.status(500).json({ message: "Error creating roadmap", error: error.toString() });
  }
};

// GET ALL USER ROADMAPS (Updated to handle ?role= filter)
export const getRoadmaps = async (req, res) => {
  try {
    const { role } = req.query;
    const query = { createdBy: req.user.id };

    // If frontend sends ?role=Full Stack, filter by that
    if (role) {
      query.career = role; // We check the 'career' field
    }

    // Sort by Newest First (-1)
    const roadmaps = await Roadmap.find(query).sort({ createdAt: -1 });
    res.json(roadmaps);

  } catch (error) {
    res.status(500).json({ message: "Error fetching roadmaps", error: error.toString() });
  }
};

// UPDATE ROADMAP STEP STATUS + PROGRESS
export const updateRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { steps } = req.body;

    // calculate progress
    const total = steps.length;
    const completed = steps.filter(step => step.completed).length;
    const progress = Math.round((completed / total) * 100);

    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { steps, progress },
      { new: true }
    );

    res.json({ message: "Roadmap updated", updatedRoadmap });

  } catch (error) {
    res.status(500).json({ message: "Error updating roadmap", error: error.toString() });
  }
};

// DELETE ROADMAP
export const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    await Roadmap.findOneAndDelete({ _id: id, createdBy: req.user.id });

    res.json({ message: "Roadmap deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting roadmap", error: error.toString() });
  }
};

// ==========================================
// ✅ NEW FUNCTIONS FOR HISTORY FEATURE
// ==========================================

// GET HISTORY LIST (Lightweight version for the Modal)
export const getRoadmapHistory = async (req, res) => {
  try {
    // Select only necessary fields to display in the list
    const history = await Roadmap.find({ createdBy: req.user.id })
      .select("career title estimatedTime createdAt progress")
      .sort({ createdAt: -1 }); // Newest first

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error: error.toString() });
  }
};

// GET SINGLE ROADMAP BY ID (For loading an old version)
export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const roadmap = await Roadmap.findOne({ _id: id, createdBy: req.user.id });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap version not found" });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error fetching specific roadmap", error: error.toString() });
  }
};