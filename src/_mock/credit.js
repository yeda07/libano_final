import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// Función para generar una fecha aleatoria en los últimos 6 meses
function generateRandomDate() {
    const currentDate = new Date();
    const pastDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - faker.datatype.number({ min: 1, max: 6 }),
    faker.datatype.number({ min: 1, max: 28 })
    );
    return pastDate.toISOString();
}

const creditApplications = [...Array(20)].map(() => ({
    id: faker.datatype.uuid(),
    applicantName: faker.name.fullName(),
    amount: faker.finance.amount(),
    status: sample(['approved', 'pending', 'rejected']),
    applicationDate: generateRandomDate(),
}));

export default creditApplications;
