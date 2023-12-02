// _mock/sales.js
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

function generateRandomDate() {
  const currentDate = new Date();
  const pastDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - faker.datatype.number({ min: 1, max: 6 }),
    faker.datatype.number({ min: 1, max: 28 })
  );
  return pastDate.toISOString();
}

const sales = [...Array(20)].map(() => ({
  id: faker.datatype.uuid(),
  userName: faker.name.fullName(),
  productName: faker.commerce.productName(),
  purchaseDate: generateRandomDate(),
}));

export default sales;
