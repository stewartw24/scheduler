# Generic Genetic Algorithm Framework

This project contains a generic, reusable genetic algorithm framework that can be applied to various optimization problems.

## Structure

### Core Components

The genetic algorithm framework is built around these core components:

- `GeneticAlgorithm<T>`: The main algorithm class that handles selection, crossover, mutation, and evolution processes
- `Individual<T>`: Represents a candidate solution with a chromosome of genes
- `Population<T>`: A collection of Individuals that evolves through generations
- `IProblemDomain<T>`: Interface that problem-specific implementations must implement

### Problem Domains

The framework includes implementations for two example problem domains:

1. **Timetable Scheduling**
   - Handles complex scheduling constraints including room capacity, professor availability, and avoiding time conflicts
   - Located in `app/AI/domains/timetable/`

2. **Traveling Salesman Problem (TSP)**
   - Finds the shortest path through a set of cities
   - Located in `app/AI/domains/tsp/`

## How It Works

The genetic algorithm works as follows:

1. **Initialization**: Create an initial random population
2. **Evaluation**: Calculate fitness of each individual based on problem-specific criteria
3. **Selection**: Select individuals for reproduction using tournament selection
4. **Crossover**: Create new individuals by combining genes from parents
5. **Mutation**: Introduce random changes to maintain genetic diversity
6. **Replacement**: Replace the old population with the new one
7. **Termination**: Stop when a solution is found or max generations reached

## Adding New Problem Domains

To apply the genetic algorithm to a new problem:

1. Create a new folder in `app/AI/domains/` for your problem
2. Implement the `IProblemDomain<T>` interface:
   - `createIndividual()`: Create a randomly initialized individual
   - `createEmptyIndividual(length)`: Create an empty individual with the specified chromosome length
   - `calculateFitness(individual)`: Calculate fitness value (0.0 to 1.0) for an individual
   - `validateIndividual(individual)`: Apply problem-specific validation or repair
   - `decodeSolution(bestIndividual)`: Convert the chromosome into a problem-specific solution

3. Create a solver class that uses the genetic algorithm with your problem domain

## Examples

Check out the `/genetic-examples` page for interactive demonstrations of the framework solving different problems.

## Generic vs Domain-Specific

The original timetable scheduling algorithm has been refactored so that:

1. The core algorithm logic is completely generic and can be reused
2. Problem-specific constraints and evaluation are separated into domain implementations
3. New problem domains can be added without modifying the core algorithm

This approach makes the code more maintainable, extensible, and promotes code reuse across different optimization problems.
