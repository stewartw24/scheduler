'use client';

import { useState } from 'react';
import { TimetableGA } from '../AI/domains/timetable/TimetableGA';
import { TSPSolver } from '../AI/domains/tsp/TSPSolver';
import { TimetableInputData, TimetableResultData } from '../types/timetable-ga.interface';

// Define the TSPResult interface to match what TSPSolver returns
interface TSPResult {
  distance: number;
  path: string[]; // city names in order
  pathIds: number[]; // city ids in order
  computationTime: number; // in milliseconds
}

// Example timetable data
const sampleTimetableData: TimetableInputData = {
  rooms: [
    { roomId: 1, roomNumber: 'A101', capacity: 30 },
    { roomId: 2, roomNumber: 'B102', capacity: 45 },
    { roomId: 3, roomNumber: 'C103', capacity: 25 },
    { roomId: 4, roomNumber: 'D104', capacity: 35 },
  ],
  timeslots: [
    { timeslotId: 1, timeslot: 'Monday 9:00 - 11:00' },
    { timeslotId: 2, timeslot: 'Monday 11:00 - 13:00' },
    { timeslotId: 3, timeslot: 'Tuesday 9:00 - 11:00' },
    { timeslotId: 4, timeslot: 'Tuesday 11:00 - 13:00' },
  ],
  professors: [
    { professorId: 1, professorName: 'Dr. Smith' },
    { professorId: 2, professorName: 'Dr. Jones' },
    { professorId: 3, professorName: 'Dr. Williams' },
  ],
  modules: [
    {
      moduleId: 1,
      moduleCode: 'CS101',
      module: 'Introduction to Programming',
      professorIds: [1, 2],
    },
    { moduleId: 2, moduleCode: 'CS102', module: 'Data Structures', professorIds: [1, 3] },
    { moduleId: 3, moduleCode: 'CS103', module: 'Algorithms', professorIds: [2, 3] },
  ],
  groups: [
    { groupId: 1, groupSize: 20, moduleIds: [1, 2] },
    { groupId: 2, groupSize: 30, moduleIds: [1, 3] },
    { groupId: 3, groupSize: 25, moduleIds: [2, 3] },
  ],
};

// Example TSP data
const cities = [
  { id: 1, name: 'New York', x: 40.7128, y: -74.006 },
  { id: 2, name: 'Los Angeles', x: 34.0522, y: -118.2437 },
  { id: 3, name: 'Chicago', x: 41.8781, y: -87.6298 },
  { id: 4, name: 'Houston', x: 29.7604, y: -95.3698 },
  { id: 5, name: 'Phoenix', x: 33.4484, y: -112.074 },
  { id: 6, name: 'Philadelphia', x: 39.9526, y: -75.1652 },
  { id: 7, name: 'San Antonio', x: 29.4241, y: -98.4936 },
  { id: 8, name: 'San Diego', x: 32.7157, y: -117.1611 },
];

export default function GeneticExamples() {
  const [activeTab, setActiveTab] = useState('timetable');
  const [timetableResult, setTimetableResult] = useState<TimetableResultData[] | null>(null);
  const [tspResult, setTspResult] = useState<TSPResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runTimetableExample = () => {
    setIsCalculating(true);
    setTimeout(() => {
      try {
        const timetableGA = new TimetableGA();
        const result = timetableGA.initAI(sampleTimetableData);
        setTimetableResult(result);
      } catch (error) {
        console.error('Error running timetable example:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 100); // Use setTimeout to allow UI to update
  };

  const runTSPExample = () => {
    setIsCalculating(true);
    setTimeout(() => {
      try {
        const tspSolver = new TSPSolver();
        const result = tspSolver.solve(cities, {
          populationSize: 100,
          mutationRate: 0.05,
          crossoverRate: 0.95,
          elitismCount: 5,
          tournamentSize: 10,
          maxGenerations: 500,
        });
        setTspResult(result);
      } catch (error) {
        console.error('Error running TSP example:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 100); // Use setTimeout to allow UI to update
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Generic Genetic Algorithm Examples</h1>

      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'timetable' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          Timetable Scheduling
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'tsp' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => setActiveTab('tsp')}
        >
          Traveling Salesman Problem
        </button>
      </div>

      <div className="mb-6">
        {activeTab === 'timetable' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Timetable Scheduling</h2>
            <p className="mb-4">
              This example uses the genetic algorithm to schedule classes, ensuring no conflicts in
              room assignments, professor assignments, and time slots.
            </p>
            <button
              onClick={runTimetableExample}
              disabled={isCalculating}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
            >
              {isCalculating ? 'Calculating...' : 'Run Timetable Example'}
            </button>

            {timetableResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <p className="mb-2">
                  Generated {timetableResult.length} classes with no conflicts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timetableResult.slice(0, 6).map((item, index) => (
                    <div key={index} className="border p-3 rounded bg-gray-50">
                      <h4 className="font-semibold">Class {item.class}</h4>
                      <div className="text-sm">
                        <div>Module: {item.moduleName}</div>
                        <div>
                          Group: Group {item.groupId} (Size: {item.groupSize})
                        </div>
                        <div>
                          Room: {item.roomNumber} (Capacity: {item.roomCapacity})
                        </div>
                        <div>Professor: {item.professor}</div>
                        <div>Time: {item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Traveling Salesman Problem</h2>
            <p className="mb-4">
              This example uses the genetic algorithm to find the shortest route that visits each
              city exactly once and returns to the starting city.
            </p>
            <button
              onClick={runTSPExample}
              disabled={isCalculating}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
            >
              {isCalculating ? 'Calculating...' : 'Run TSP Example'}
            </button>

            {tspResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <div className="border p-4 rounded bg-gray-50">
                  <p>
                    <strong>Best Tour Distance:</strong> {tspResult.distance.toFixed(2)} units
                  </p>
                  <p>
                    <strong>Computation Time:</strong> {tspResult.computationTime}ms
                  </p>
                  <p className="mt-2">
                    <strong>Tour Path:</strong>
                  </p>
                  <p className="bg-white p-2 border rounded mt-1">
                    {tspResult.path.join(' → ')} → {tspResult.path[0]}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">About the Generic Genetic Algorithm</h2>
        <p className="mb-2">
          This implementation demonstrates how a genetic algorithm can be made generic and applied
          to different problem domains. The core algorithm is separated from the specific problem
          constraints and evaluation methods.
        </p>
        <p>
          The structure consists of a generic core (<code>GeneticAlgorithm</code>,{' '}
          <code>Population</code>,<code>Individual</code>) and domain-specific implementations that
          implement the
          <code>IProblemDomain</code> interface. This allows the same algorithm to solve completely
          different problems without modifying the core logic.
        </p>
      </div>
    </div>
  );
}
