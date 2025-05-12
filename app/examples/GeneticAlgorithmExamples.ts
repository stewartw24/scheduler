import { TimetableGA } from '../AI/domains/timetable/TimetableGA';
import { TSPSolver } from '../AI/domains/tsp/TSPSolver';
import { TimetableInputData } from '../AI/domains/timetable/types/timetable-ga.interface';

/**
 * Example usage of the genetic algorithm framework for different problem domains
 */
export class GeneticAlgorithmExamples {
  /**
   * Example of solving a timetable scheduling problem
   */
  static runTimetableExample(data: TimetableInputData) {
    console.log('Running Timetable Scheduling Example:');
    console.time('TimetableScheduling');

    const timetableGA = new TimetableGA();
    const solution = timetableGA.initAI(data);

    console.timeEnd('TimetableScheduling');
    console.log(`Generated ${solution.length} classes with no conflicts.`);

    // Print the first few classes as a sample
    solution.slice(0, 3).forEach((classItem, index) => {
      console.log(`Class ${index + 1}:`);
      console.log(`  Module: ${classItem.moduleName}`);
      console.log(`  Group: ${classItem.groupId} (Size: ${classItem.groupSize})`);
      console.log(`  Room: ${classItem.roomNumber} (Capacity: ${classItem.roomCapacity})`);
      console.log(`  Professor: ${classItem.professor}`);
      console.log(`  Time: ${classItem.time}`);
    });

    return solution;
  }

  /**
   * Example of solving a traveling salesman problem
   */
  static runTSPExample() {
    console.log('Running Traveling Salesman Problem Example:');

    // Define some cities
    const cities = [
      { id: 1, name: 'New York', x: 40.7128, y: -74.006 },
      { id: 2, name: 'Los Angeles', x: 34.0522, y: -118.2437 },
      { id: 3, name: 'Chicago', x: 41.8781, y: -87.6298 },
      { id: 4, name: 'Houston', x: 29.7604, y: -95.3698 },
      { id: 5, name: 'Phoenix', x: 33.4484, y: -112.074 },
      { id: 6, name: 'Philadelphia', x: 39.9526, y: -75.1652 },
      { id: 7, name: 'San Antonio', x: 29.4241, y: -98.4936 },
      { id: 8, name: 'San Diego', x: 32.7157, y: -117.1611 },
      { id: 9, name: 'Dallas', x: 32.7767, y: -96.797 },
      { id: 10, name: 'San Jose', x: 37.3382, y: -121.8863 },
    ];

    console.time('TSP');

    const tspSolver = new TSPSolver();
    const solution = tspSolver.solve(cities, {
      populationSize: 200, // Larger population for better exploration
      mutationRate: 0.02, // Slightly higher mutation rate for TSP
      crossoverRate: 0.95, // High crossover rate
      elitismCount: 5, // Keep more elite solutions
      tournamentSize: 7, // Larger tournament size for better selection
      maxGenerations: 1500, // More generations for convergence
    });

    console.timeEnd('TSP');

    console.log(`Best tour distance: ${solution.distance.toFixed(2)} units`);
    console.log('Tour: ' + solution.path.join(' -> ') + ' -> ' + solution.path[0]);
    console.log(`Computation Time: ${solution.computationTime}ms`);

    return solution;
  }
}

// Example of how to use these examples in your application
/*
// For Timetable Scheduling
import { timetableData } from './data/timetable-data';
const timetableSolution = GeneticAlgorithmExamples.runTimetableExample(timetableData);

// For Traveling Salesman Problem
const tspSolution = GeneticAlgorithmExamples.runTSPExample();
*/
