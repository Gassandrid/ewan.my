#!/usr/bin/env python3
"""
Simple kernel color tally program
Press 'y' for yellow, 'p' for purple, 'q' to quit
"""

def main():
    yellow_count = 0
    purple_count = 0

    print("Kernel Color Tally Program")
    print("=" * 40)
    print("Press 'y' for Yellow")
    print("Press 'p' for Purple")
    print("Press 'q' to Quit and see results")
    print("=" * 40)

    while True:
        key = input("\nEnter color (y/p/q): ").lower().strip()

        if key == 'y':
            yellow_count += 1
            print(f"Yellow: {yellow_count} | Purple: {purple_count}")
        elif key == 'p':
            purple_count += 1
            print(f"Yellow: {yellow_count} | Purple: {purple_count}")
        elif key == 'q':
            break
        else:
            print("Invalid input. Please enter 'y', 'p', or 'q'")

    # Display final results
    print("\n" + "=" * 40)
    print("FINAL TALLY:")
    print("=" * 40)
    print(f"Yellow kernels: {yellow_count}")
    print(f"Purple kernels: {purple_count}")
    print(f"Total kernels: {yellow_count + purple_count}")

    if yellow_count + purple_count > 0:
        yellow_percent = (yellow_count / (yellow_count + purple_count)) * 100
        purple_percent = (purple_count / (yellow_count + purple_count)) * 100
        print(f"\nYellow: {yellow_percent:.1f}%")
        print(f"Purple: {purple_percent:.1f}%")

        # Expected ratio for Dd x Dd cross is 3:1 (75% purple, 25% yellow)
        print(f"\nExpected ratio (3:1): 75% Purple, 25% Yellow")
    print("=" * 40)

if __name__ == "__main__":
    main()
