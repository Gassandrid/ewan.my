#!/usr/bin/env python3
"""
Paramecia Lab Data Analysis Program

This program implements the formal experiment design for analyzing
Paramecia distribution between Control and Test environments.

Mathematical Definition:
- Trials T = {T₁, T₂, ..., Tₙ} where n ≥ 10
- Each trial Tₙ := {Pₙ, Pₙ∈C, Pₙ∈T, Pₙ∈C/Pₙ, Pₙ∈T/Pₙ}

Constants:
- Duration: 2.5 minutes
- Distance: 1/4 inch
- Count: 3 drops
"""

import statistics
import json
from typing import List, Dict, Tuple, Optional

class TrialData:
    """Represents a single trial with its 5-tuple structure"""

    def __init__(self, trial_num: int, total_paramecia: int,
                 control_count: int, test_count: int):
        self.trial_num = trial_num
        self.total_paramecia = total_paramecia
        self.control_count = control_count
        self.test_count = test_count

        # Calculate proportions
        if total_paramecia > 0:
            self.control_proportion = control_count / total_paramecia
            self.test_proportion = test_count / total_paramecia
        else:
            self.control_proportion = 0.0
            self.test_proportion = 0.0

    def __str__(self):
        return (f"Trial {self.trial_num}: {self.total_paramecia} total, "
                f"{self.control_count} control ({self.control_proportion:.4f}), "
                f"{self.test_count} test ({self.test_proportion:.4f})")

    def to_dict(self):
        """Convert trial to dictionary for saving/loading"""
        return {
            'trial_num': self.trial_num,
            'total_paramecia': self.total_paramecia,
            'control_count': self.control_count,
            'test_count': self.test_count,
            'control_proportion': self.control_proportion,
            'test_proportion': self.test_proportion
        }

class ExperimentData:
    """Manages all trial data and statistical calculations"""

    def __init__(self):
        self.trials: List[TrialData] = []
        self.constants = {
            'duration_minutes': 2.5,
            'distance_inch': 0.25,
            'drop_count': 3
        }
        self._load_existing_data()

    def _load_existing_data(self):
        """Load existing data if available, otherwise initialize with provided data"""
        # Initialize with the provided data from the table
        initial_data = [
            (1, 5, 2, 0),  # Trial 1: 5 total, 2 control, 0 test
            (2, 7, 0, 0),  # Trial 2: 7 total, 0 control, 0 test (missing test count)
            (3, 7, 3, 0),  # Trial 3: 7 total, 3 control, 0 test (missing test count)
            (4, 7, 6, 0),  # Trial 4: 7 total, 6 control, 0 test (missing test count)
        ]

        for trial_num, total, control, test in initial_data:
            # For trials 2-4, calculate test count as total - control if test is 0
            if trial_num in [2, 3, 4] and test == 0:
                test = total - control

            trial = TrialData(trial_num, total, control, test)
            self.trials.append(trial)

    def add_trial(self, trial_num: int, total_paramecia: int,
                  control_count: int, test_count: int):
        """Add a new trial to the dataset"""
        # Validate data
        if total_paramecia < 0 or control_count < 0 or test_count < 0:
            raise ValueError("Counts cannot be negative")

        if control_count + test_count > total_paramecia:
            raise ValueError("Control + Test count cannot exceed total")

        trial = TrialData(trial_num, total_paramecia, control_count, test_count)

        # Update existing trial or add new one
        existing_trial_index = None
        for i, existing_trial in enumerate(self.trials):
            if existing_trial.trial_num == trial_num:
                existing_trial_index = i
                break

        if existing_trial_index is not None:
            self.trials[existing_trial_index] = trial
        else:
            self.trials.append(trial)
            self.trials.sort(key=lambda x: x.trial_num)

    def get_control_proportions(self) -> List[float]:
        """Get all control proportions for statistical analysis"""
        return [trial.control_proportion for trial in self.trials if trial.total_paramecia > 0]

    def get_test_proportions(self) -> List[float]:
        """Get all test proportions for statistical analysis"""
        return [trial.test_proportion for trial in self.trials if trial.total_paramecia > 0]

    def calculate_statistics(self) -> Dict[str, Dict[str, float]]:
        """Calculate averages and standard deviations for proportions"""
        control_props = self.get_control_proportions()
        test_props = self.get_test_proportions()

        stats = {}

        if control_props:
            stats['control'] = {
                'average': statistics.mean(control_props),
                'std_dev': statistics.stdev(control_props) if len(control_props) > 1 else 0.0,
                'count': len(control_props)
            }
        else:
            stats['control'] = {'average': 0.0, 'std_dev': 0.0, 'count': 0}

        if test_props:
            stats['test'] = {
                'average': statistics.mean(test_props),
                'std_dev': statistics.stdev(test_props) if len(test_props) > 1 else 0.0,
                'count': len(test_props)
            }
        else:
            stats['test'] = {'average': 0.0, 'std_dev': 0.0, 'count': 0}

        return stats

    def display_data_table(self):
        """Display data in tabular format"""
        print("\n" + "="*80)
        print("PARAMECIA EXPERIMENT DATA")
        print("="*80)
        print(f"Constants: Duration = {self.constants['duration_minutes']} min, "
              f"Distance = {self.constants['distance_inch']} in, "
              f"Drops = {self.constants['drop_count']}")
        print("-"*80)
        print(f"{'Trial':<6} {'Total':<6} {'Control':<8} {'Test':<6} {'Prop_Control':<12} {'Prop_Test':<10}")
        print("-"*80)

        for trial in sorted(self.trials, key=lambda x: x.trial_num):
            print(f"{trial.trial_num:<6} {trial.total_paramecia:<6} "
                  f"{trial.control_count:<8} {trial.test_count:<6} "
                  f"{trial.control_proportion:<12.4f} {trial.test_proportion:<10.4f}")

        # Show empty rows for remaining trials up to 10
        max_trial = max(trial.trial_num for trial in self.trials) if self.trials else 0
        for trial_num in range(max_trial + 1, 11):
            print(f"{trial_num:<6} {'--':<6} {'--':<8} {'--':<6} {'--':<12} {'--':<10}")

        print("-"*80)

    def display_statistics(self):
        """Display calculated statistics"""
        stats = self.calculate_statistics()

        print("\n" + "="*60)
        print("STATISTICAL ANALYSIS")
        print("="*60)

        print("Control Proportions:")
        print(f"  Average: {stats['control']['average']:.4f}")
        print(f"  Standard Deviation: {stats['control']['std_dev']:.4f}")
        print(f"  Sample Size: {stats['control']['count']}")

        print("\nTest Proportions:")
        print(f"  Average: {stats['test']['average']:.4f}")
        print(f"  Standard Deviation: {stats['test']['std_dev']:.4f}")
        print(f"  Sample Size: {stats['test']['count']}")
        print("="*60)

    def save_to_file(self, filename: str = "experiment_data.json"):
        """Save data to JSON file"""
        data = {
            'constants': self.constants,
            'trials': [trial.to_dict() for trial in self.trials],
            'statistics': self.calculate_statistics()
        }

        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {filename}")

def interactive_data_entry(experiment: ExperimentData):
    """Interactive interface for entering trial data"""
    print("\n" + "="*60)
    print("INTERACTIVE DATA ENTRY")
    print("="*60)
    print("Enter data for remaining trials (5-10)")
    print("Enter 'q' to quit, 's' to show current data, 'stats' for statistics")
    print("-"*60)

    while True:
        try:
            user_input = input("\nEnter trial number (5-10) or command: ").strip().lower()

            if user_input == 'q':
                break
            elif user_input == 's':
                experiment.display_data_table()
                continue
            elif user_input == 'stats':
                experiment.display_statistics()
                continue

            trial_num = int(user_input)
            if trial_num < 5 or trial_num > 10:
                print("Trial number must be between 5 and 10")
                continue

            total = int(input(f"Trial {trial_num} - Total number of Paramecia: "))
            if total < 0:
                print("Total cannot be negative")
                continue

            control = int(input(f"Trial {trial_num} - Number in Control: "))
            if control < 0 or control > total:
                print("Control count must be between 0 and total")
                continue

            test = int(input(f"Trial {trial_num} - Number in Test: "))
            if test < 0 or test > total:
                print("Test count must be between 0 and total")
                continue

            if control + test > total:
                print("Control + Test cannot exceed total. Auto-adjusting...")
                test = total - control
                print(f"Test count adjusted to: {test}")

            experiment.add_trial(trial_num, total, control, test)
            print(f"Trial {trial_num} added successfully!")

        except ValueError as e:
            print(f"Invalid input: {e}. Please enter valid numbers.")
        except KeyboardInterrupt:
            print("\n\nData entry interrupted by user.")
            break

def main():
    """Main program execution"""
    print("PARAMECIA EXPERIMENT DATA ANALYSIS")
    print("="*50)

    # Initialize experiment with existing data
    experiment = ExperimentData()

    while True:
        print("\nOptions:")
        print("1. Show current data table")
        print("2. Show statistics")
        print("3. Enter new trial data")
        print("4. Save data to file")
        print("5. Exit")

        choice = input("\nSelect option (1-5): ").strip()

        if choice == '1':
            experiment.display_data_table()
        elif choice == '2':
            experiment.display_statistics()
        elif choice == '3':
            interactive_data_entry(experiment)
        elif choice == '4':
            filename = input("Enter filename (default: experiment_data.json): ").strip()
            if not filename:
                filename = "experiment_data.json"
            experiment.save_to_file(filename)
        elif choice == '5':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please select 1-5.")

if __name__ == "__main__":
    main()

