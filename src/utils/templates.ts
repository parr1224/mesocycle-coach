
export const presetTemplates = [
  {
    name: "Push/Legs/Pull (6 Weeks)",
    weeks: 6,
    weekDetails: Array.from({ length: 6 }, (_, i) => ({
      rir: 3 - Math.min(i, 3),
      split: "Push/Legs/Pull",
      days: [
        { label: "Day 1: Push", exercises: [] },
        { label: "Day 2: Legs", exercises: [] },
        { label: "Day 3: Pull", exercises: [] },
        { label: "Day 4: Push", exercises: [] },
        { label: "Day 5: Legs", exercises: [] },
        { label: "Day 6: Pull", exercises: [] }
      ]
    }))
  },
  {
    name: "Full Body (4 Weeks)",
    weeks: 4,
    weekDetails: Array.from({ length: 4 }, (_, i) => ({
      rir: 3 - Math.min(i, 3),
      split: "Full Body",
      days: [
        { label: "Day 1: Full Body", exercises: [] },
        { label: "Day 2: Full Body", exercises: [] },
        { label: "Day 3: Full Body", exercises: [] },
        { label: "Day 4: Full Body", exercises: [] },
        { label: "Day 5: Full Body", exercises: [] }
      ]
    }))
  },
  {
    name: "Upper/Lower (5 Weeks)",
    weeks: 5,
    weekDetails: Array.from({ length: 5 }, (_, i) => ({
      rir: 3 - Math.min(i, 3),
      split: "Upper/Lower",
      days: [
        { label: "Day 1: Upper", exercises: [] },
        { label: "Day 2: Lower", exercises: [] },
        { label: "Day 3: Upper", exercises: [] },
        { label: "Day 4: Lower", exercises: [] },
        { label: "Day 5: Optional Accessory", exercises: [] }
      ]
    }))
  },
  {
    name: "Bro Split (5 Weeks)",
    weeks: 5,
    weekDetails: Array.from({ length: 5 }, (_, i) => ({
      rir: 3 - Math.min(i, 3),
      split: "Body Part Split",
      days: [
        { label: "Day 1: Chest", exercises: [] },
        { label: "Day 2: Back", exercises: [] },
        { label: "Day 3: Legs", exercises: [] },
        { label: "Day 4: Shoulders", exercises: [] },
        { label: "Day 5: Arms", exercises: [] }
      ]
    }))
  },
  {
    name: "PPL 4x Weekly (6 Weeks)",
    weeks: 6,
    weekDetails: Array.from({ length: 6 }, (_, i) => ({
      rir: 3 - Math.min(i, 3),
      split: "Push/Pull/Legs",
      days: [
        { label: "Day 1: Push", exercises: [] },
        { label: "Day 2: Pull", exercises: [] },
        { label: "Day 3: Legs", exercises: [] },
        { label: "Day 4: Rest/Conditioning", exercises: [] }
      ]
    }))
  },
  {
    name: "Conditioning + Strength (3 Days x 4 Weeks)",
    weeks: 4,
    weekDetails: Array.from({ length: 4 }, () => ({
      rir: 2,
      split: "Strength + Cardio",
      days: [
        { label: "Day 1: Full Body Strength", exercises: [] },
        { label: "Day 2: Conditioning (Sled/Row/Run)", exercises: [] },
        { label: "Day 3: Full Body Strength", exercises: [] }
      ]
    }))
  },
  {
    name: "Beginner Linear Progression (4 Weeks)",
    weeks: 4,
    weekDetails: Array.from({ length: 4 }, (__, i) => ({
      rir: 3 - i,
      split: "Linear Full Body",
      days: [
        { label: "Day 1: Squat + Press", exercises: [] },
        { label: "Day 2: Deadlift + Pull", exercises: [] },
        { label: "Day 3: Optional Cardio", exercises: [] }
      ]
    }))
  }
];
