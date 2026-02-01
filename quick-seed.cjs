const mongoose = require('mongoose');

// Simple script to seed basic data for testing
async function quickSeed() {
  const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/techcure';
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('Connected!');

    // Create a simple physics subject for testing
    const Subject = mongoose.model('Subject', new mongoose.Schema({
      _id: String,
      code: String,
      name: String,
      description: String,
      course: String,
      class: String,
      examType: String
    }));

    const Topic = mongoose.model('Topic', new mongoose.Schema({
      code: String,
      title: String,
      description: String,
      subject: String,
      examWeight: Number,
      requiredDepth: String,
      commonMistakes: [String],
      estimatedTime: String,
      dependencies: [String],
      priority: String,
      position: { x: Number, y: Number }
    }));

    // Clear existing data
    await Subject.deleteMany({});
    await Topic.deleteMany({});

    // Insert physics subject
    await Subject.create({
      _id: "physics-12-cbse",
      code: "physics",
      name: "Physics",
      description: "Class 12 Physics covering electromagnetism, optics, modern physics, and electronics",
      course: "cbse",
      class: "12",
      examType: "board"
    });

    // Insert some physics topics
    const topics = [
      {
        code: "electrostatics",
        title: "Electrostatics",
        description: "Electric charges, Coulomb's law, electric fields, electric potential, capacitance, and dielectrics.",
        subject: "physics-12-cbse",
        examWeight: 50,
        requiredDepth: "Master",
        commonMistakes: ["Sign errors in electric potential calculations"],
        estimatedTime: "15-18 hours",
        dependencies: [],
        priority: "high",
        position: { x: 250, y: 0 }
      },
      {
        code: "current-electricity",
        title: "Current Electricity",
        description: "Ohm's law, electrical resistance, cells and EMF, Kirchhoff's laws.",
        subject: "physics-12-cbse",
        examWeight: 35,
        requiredDepth: "Master",
        commonMistakes: ["Incorrect setup of Kirchhoff's loop equations"],
        estimatedTime: "12-14 hours",
        dependencies: ["electrostatics"],
        priority: "high",
        position: { x: 250, y: 150 }
      },
      {
        code: "optics-ray",
        title: "Ray Optics",
        description: "Reflection, refraction, total internal reflection, prisms, lenses, mirrors.",
        subject: "physics-12-cbse",
        examWeight: 35,
        requiredDepth: "Master",
        commonMistakes: ["Sign convention errors in mirror and lens equations"],
        estimatedTime: "12-14 hours",
        dependencies: [],
        priority: "high",
        position: { x: 400, y: 300 }
      },
      {
        code: "semiconductors",
        title: "Semiconductor Electronics",
        description: "Energy bands, intrinsic and extrinsic semiconductors, p-n junction diodes.",
        subject: "physics-12-cbse",
        examWeight: 30,
        requiredDepth: "Understand",
        commonMistakes: ["Forward and reverse bias confusion in p-n junctions"],
        estimatedTime: "10-12 hours",
        dependencies: [],
        priority: "medium",
        position: { x: 700, y: 300 }
      },
      {
        code: "communication",
        title: "Communication Systems",
        description: "Elements of communication systems, bandwidth, signal propagation modes.",
        subject: "physics-12-cbse",
        examWeight: 10,
        requiredDepth: "Familiar",
        commonMistakes: ["Modulation index calculation errors"],
        estimatedTime: "4-5 hours",
        dependencies: [],
        priority: "low",
        position: { x: 700, y: 450 }
      }
    ];

    await Topic.insertMany(topics);

    console.log('✅ Seeded successfully!');
    console.log(`   Subjects: 1`);
    console.log(`   Topics: ${topics.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

quickSeed();