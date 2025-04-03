const fs = require('fs');

const nouns = ["Gadget", "Tool", "Device", "Accessory", "Camera", "Object", "Widget", "Product", "Thing", "Gear", "Phone", "Laptop", "Headphones"];
const actions = ["enhances", "improves", "transforms", "elevates", "simplifies", "revolutionizes", "modernizes"];
const features = ["your lifestyle", "daily routine", "efficiency", "performance", "convenience", "comfort", "experience"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const items = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}: ${getRandomElement(nouns)}`,
  description: `${getRandomElement(actions)} ${getRandomElement(features)}.`,
  // name: `Item ${i + 1}`,
  // description: `Description for Item ${i + 1}`,
  price: (Math.random() * 100).toFixed(2),
  image: `https://picsum.photos/id/${i % 100}/200/200`
}));

fs.writeFileSync('data.json', JSON.stringify(items, null, 2));