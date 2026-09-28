const quirkyAdjectives = [
  "Juicy",
  "Fussy",
  "Lopsided",
  "Spicy",
  "Silly",
  "Funky",
  "Chonky",
  "Wobbly",
  "Sleepy",
  "Fancy",
  "Dinosaur",
  "Eggplant",
  "Hedgehog",
  "Tangerine",
  "Muffin",
  "Pickle",
  "Waffle",
  "Noodle",
  "Panda",
  "Avocado",
];

const quirkyNouns = [
  "Banana",
  "Biscuit",
  "Scooter",
  "Gnome",
  "Cactus",
  "Walrus",
  "Pug",
  "Donut",
  "Badger",
  "Yeti",
];

const natureAdjectives = [
  "Autumn",
  "Hidden",
  "Bitter",
  "Misty",
  "Silent",
  "Empty",
  "Dry",
  "Dark",
  "Summer",
  "Icy",
  "Delicate",
  "Quiet",
  "White",
  "Cool",
  "Spring",
  "Winter",
  "Patient",
  "Twilight",
  "Dawn",
  "Crimson",
  "Wispy",
  "Weathered",
  "Blue",
  "Billowing",
  "Broken",
  "Cold",
  "Damp",
  "Falling",
  "Frosty",
  "Green",
  "Long",
  "Late",
  "Lingering",
  "Bold",
  "Little",
  "Morning",
  "Muddy",
  "Old",
];

const natureNouns = [
  "Waterfall",
  "River",
  "Breeze",
  "Moon",
  "Rain",
  "Wind",
  "Sea",
  "Snow",
  "Lake",
  "Sunset",
  "Pine",
  "Shadow",
  "Leaf",
  "Glitter",
  "Forest",
  "Hill",
  "Cloud",
  "Meadow",
  "Valley",
  "Echo",
];

const adjectives = [...quirkyAdjectives, natureAdjectives];
const nouns = [...quirkyNouns, ...natureNouns];

export const usernameGenerator = () => {
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  const randomDigits = Math.floor(100 + Math.random() * 9000); // Generates 3 to 4 digits

  return `${randomAdj}${randomNoun}${randomDigits}`;
};
