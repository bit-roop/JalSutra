export type Mission = {
  id: "sparrow" | "mesh" | "water-bowl";
  title: string;
  description: string;
  category: "Birds" | "Fish" | "Water" | "Plants" | "Farming";
  participants: number;
  points: number;
  image: string;
};

export const missions: Mission[] = [
  {
    id: "sparrow",
    title: "Earthen Nest for Sparrow",
    description: "Provide safe earthen nests for sparrows and help them thrive in our villages.",
    category: "Birds",
    participants: 1248,
    points: 250,
    image: "/images/missions/earthen-nest.jpg",
  },
  {
    id: "mesh",
    title: "Big Mesh Small Harm",
    description: "Use the right net size. Protect young fish and keep our waters alive.",
    category: "Fish",
    participants: 987,
    points: 200,
    image: "/images/missions/big-mesh.jpg",
  },
  {
    id: "water-bowl",
    title: "Summer Water Bowl",
    description: "Place water bowls for birds and animals. Small acts, big impact in summer.",
    category: "Birds",
    participants: 1532,
    points: 150,
    image: "/images/missions/summer-water-bowl.jpg",
  },
];
