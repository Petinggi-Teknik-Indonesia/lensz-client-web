import { faker } from "@faker-js/faker";
import type { Glasses } from "@/types/glasses";


const createGlasses = (numGlasses: number) => {
  const glasses: Glasses[] = [];
  for (let i = 0; i < numGlasses; i++) {
    glasses.push({
      rfid: faker.string.uuid(), // use uuid for realistic RFID simulation
      name: faker.commerce.productName(),
      type: faker.commerce.productAdjective(),
      color: faker.color.human(),
      status: faker.helpers.arrayElement(["Available", "Borrowed", "Maintenance", "Lost"]),
      drawer: `Drawer ${faker.number.int({ min: 1, max: 10 })}`,
      company: faker.company.name(),
      brand: faker.commerce.department(),
    });
  }
  return glasses;
};

// console.log(createGlasses(100));

export const data: Glasses[] = [...createGlasses(100)]; 