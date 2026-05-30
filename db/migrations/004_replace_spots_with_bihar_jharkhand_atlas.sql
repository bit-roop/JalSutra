BEGIN;

DELETE FROM spots
WHERE name IN (
  'Bhitoli Seasonal Wetland',
  'Devrai Sacred Grove',
  'Haiderpur Bird Zone',
  'Narora No Fishing Zone',
  'Kanwar Lake Wetland',
  'Vikramshila Dolphin Sanctuary',
  'Valmiki Tiger Reserve Buffer Wetlands',
  'Udhwa Bird Sanctuary',
  'Dalma Landscape'
);

INSERT INTO spots (
  name,
  category,
  description,
  latitude,
  longitude,
  location,
  city,
  district,
  status,
  verified,
  image_url,
  created_by,
  support_count,
  created_at
) VALUES
(
  'Kanwar Lake Wetland',
  'wetland',
  'An oxbow lake supporting rich biodiversity, migratory birds, and fisheries. This Ramsar wetland is a key ecological refuge in the Bihar floodplain.',
  25.6045,
  86.1377,
  'Begusarai, Bihar',
  'Begusarai',
  'Begusarai',
  'verified',
  TRUE,
  '/images/map/kanwar-lake-wetland.jpg',
  'Local Community',
  128,
  '2024-05-20T00:00:00Z'
),
(
  'Vikramshila Dolphin Sanctuary',
  'fish_zone',
  'A protected stretch of the Ganga supporting the endangered Gangetic river dolphin and the fishing communities who help safeguard its habitat.',
  25.2516,
  87.0119,
  'Bhagalpur, Bihar',
  'Bhagalpur',
  'Bhagalpur',
  'verified',
  TRUE,
  '/images/map/vikramshila-dolphin-sanctuary.jpg',
  'Fisherfolk Community',
  154,
  '2024-06-12T00:00:00Z'
),
(
  'Valmiki Tiger Reserve Buffer Wetlands',
  'wetland',
  'Seasonal wetlands along the Gandak floodplain form an important buffer for wildlife, village livelihoods, and monsoon water retention.',
  27.4215,
  84.1240,
  'West Champaran, Bihar',
  'Bagaha',
  'West Champaran',
  'verified',
  TRUE,
  '/images/map/valmiki-tiger-buffer-wetland.jpg',
  'Forest & Village Community',
  96,
  '2024-07-08T00:00:00Z'
),
(
  'Udhwa Bird Sanctuary',
  'bird_zone',
  'A wetland bird sanctuary shaped by seasonal lakes and marshes, providing vital nesting and feeding habitat for resident and migratory birds.',
  24.9844,
  87.8171,
  'Sahibganj, Jharkhand',
  'Udhwa',
  'Sahibganj',
  'under_review',
  FALSE,
  '/images/map/udhwa-bird-sanctuary.jpg',
  'Birding Community',
  84,
  '2024-08-19T00:00:00Z'
),
(
  'Dalma Landscape',
  'sacred_grove',
  'A forested hill landscape protected through local stewardship, with sacred groves and wildlife corridors connecting villages across the plateau.',
  22.9035,
  86.1858,
  'East Singhbhum, Jharkhand',
  'Jamshedpur',
  'East Singhbhum',
  'verified',
  TRUE,
  '/images/map/dalma-landscape.jpg',
  'Local Community',
  71,
  '2024-09-03T00:00:00Z'
);

COMMIT;
