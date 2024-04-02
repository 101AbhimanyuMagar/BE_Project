import { getFirestore } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase";

function Algo() {

  async function getCourseDetails(courseId) {
    const courseRef = db.collection("Courses").doc(courseId);
    const courseSnapshot = await courseRef.get();
    if (courseSnapshot.exists) {
      const courseData = courseSnapshot.data();
      const professorRef = db
        .collection("Professors")
        .doc(courseData.professorId);
      const professorSnapshot = await professorRef.get();
      const professorData = professorSnapshot.exists
        ? professorSnapshot.data().name
        : "Professor N/A";
      const roomRef = db.collection("Rooms").doc(courseData.roomId);
      const roomSnapshot = await roomRef.get();
      const roomData = roomSnapshot.exists
        ? roomSnapshot.data().number
        : "Room N/A";
      return {
        courseName: courseData.name,
        professorName: professorData,
        roomNumber: roomData,
      };
    } else {
      console.error("Course not found:", courseId);
      return null;
    }
  }

  async function getSemesterCourses(year, semester) {
    const yearRef = db.collection("Years").doc(year);
    const semesterRef = yearRef.collection("Semesters").doc(semester);
    const semesterSnapshot = await semesterRef.get();
    if (semesterSnapshot.exists) {
      return semesterSnapshot.data().courses || []; // Handle empty courses array
    } else {
      console.error("Semester not found:", year, semester);
      return [];
    }
  }

  // Chromosome representation
  const TIME_SLOTS = [
    "MON 9:15-10:15",
    "MON 10:15-11:15",
    "...", // ... other time slots for Monday to Friday
  ];

  function generateChromosome(courseIds) {
    const chromosome = [];
    for (const timeSlot of TIME_SLOTS) {
      chromosome.push(null); // Initially, all slots are empty
    }
    // Randomly assign courses to slots, ensuring no conflicts
    for (let i = 0; i < courseIds.length; i++) {
      let placed = false;
      while (!placed) {
        const randomSlot = Math.floor(Math.random() * chromosome.length);
        if (!chromosome[randomSlot]) {
          chromosome[randomSlot] = { courseId: courseIds[i] };
          placed = true;
        }
      }
    }
    return chromosome;
  }

  // Fitness function
  function calculateFitness(chromosome, courseDetails) {
    let fitness = 0;

    // Hard constraints (penalties)
    const professorAvailability = {}; // Track professor availability for each time slot
    const roomAvailability = {}; // Track room availability for each time slot
    for (let i = 0; i < chromosome.length; i++) {
      const slot = chromosome[i];
      if (slot) {
        const course = courseDetails[slot.courseId];
        const professorId = course.professorName; // Assuming professor name is stored in courseDetails
        const roomId = course.roomNumber;
        if (
          professorAvailability[i] &&
          professorAvailability[i] !== professorId
        ) {
          fitness -= 10; // Penalty for professor conflict
        } else {
          professorAvailability[i] = professorId;
        }
        if (roomAvailability[i] && roomAvailability[i] !== roomId) {
          fitness -= 10; // Penalty for room conflict
        } else {
          roomAvailability[i] = roomId;
        }
      }
    }

    // Soft constraints (bonuses)
    // ... Implement logic for minimizing gaps, similar course scheduling, professor preferences, etc.

    return fitness;
  }

  // Genetic algorithm functions
  function selection(population) {
    // Implement a selection method like roulette wheel selection
    const totalFitness = population.reduce(
      (acc, curr) => acc + curr.fitness,
      0
    );
    const selected = [];
    while (selected.length < population.length) {
      const randomFitness = Math.random() * totalFitness;
      let currentFitness = 0;
      for (const chromosome of population) {
        currentFitness += chromosome.fitness;
        if (currentFitness >= randomFitness) {
          selected.push(chromosome);
          break;
        }
      }
    }
    return selected;
  }

  function crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const offspring1 = parent1
      .slice(0, crossoverPoint)
      .concat(parent2.slice(crossoverPoint));
    const offspring2 = parent2
      .slice(0, crossoverPoint)
      .concat(parent1.slice(crossoverPoint));
    return [offspring1, offspring2];
  }

  function mutation(chromosome, mutationRate) {
    for (let i = 0; i < chromosome.length; i++) {
      if (Math.random() < mutationRate) {
        chromosome[i] = null; // Clear the slot
      }
    }
    return chromosome;
  }

  // Genetic algorithm execution
  async function generateTimetable(year, semester) {
    const courseIds = await getSemesterCourses(year, semester);
    const courseDetails = await Promise.all(courseIds.map(getCourseDetails));

    const populationSize = 50; // Adjust population size as needed
    const mutationRate = 0.01; // Adjust mutation rate as needed
    const maxGenerations = 100; // Adjust maximum generations as needed

    let population = [];
    for (let i = 0; i < populationSize; i++) {
      population.push(generateChromosome(courseIds.slice()));
    }

    for (let generation = 0; generation < maxGenerations; generation++) {
      // Evaluate fitness
      for (const chromosome of population) {
        chromosome.fitness = calculateFitness(chromosome, courseDetails);
      }

      // Selection
      const selected = selection(population);

      // Crossover
      const offspring = [];
      for (let i = 0; i < Math.floor(populationSize / 2); i++) {
        const [child1, child2] = crossover(selected[i], selected[i + 1]);
        offspring.push(child1, child2);
      }

      // Mutation
      for (let i = 0; i < offspring.length; i++) {
        offspring[i] = mutation(offspring[i], mutationRate);
      }

      // Combine population and offspring for next generation
      population = population.concat(offspring);
    }

    // Select the best chromosome (highest fitness)
    const bestChromosome = population.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );

    // Decode chromosome and construct timetable
    const timetable = [];
    for (const slot of bestChromosome) {
      if (slot) {
        const courseDetail = await getCourseDetails(slot.courseId);
        timetable.push({
          timeSlot: slot,
          course: courseDetail ? courseDetail.courseName : "Course N/A",
          professor: courseDetail
            ? courseDetail.professorName
            : "Professor N/A",
          room: courseDetail ? courseDetail.roomNumber : "Room N/A",
        });
      } else {
        timetable.push({ timeSlot: slot, course: "", professor: "", room: "" });
      }
    }

    return timetable;
  }

  // Example usage:
  generateTimetable("2023", "2nd").then((timetable) => {
    console.log(timetable);
    // Process the timetable data here (e.g., display in a table)
  });
}

export default Algo;
