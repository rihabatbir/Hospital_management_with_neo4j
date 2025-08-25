// backend/models/patientModel.js
import driver from '../config/neo4j.js';

const getAllPatients = async () => {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (p:Patient) RETURN p');
    return result.records.map(record => record.get('p').properties);
  } finally {
    await session.close();
  }
};

const createPatient = async (patient) => {
  const session = driver.session();
  const { patient_id, nom, prenom, date_naissance } = patient;
  try {
    await session.run(
      'CREATE (p:Patient {patient_id: $patient_id, nom: $nom, prenom: $prenom, date_naissance: $date_naissance})',
      { patient_id, nom, prenom, date_naissance }
    );
  } finally {
    await session.close();
  }
};

const deletePatient = async (patient_id) => {
  const session = driver.session();
  try {
    await session.run(
      'MATCH (p:Patient {patient_id: $patient_id}) DETACH DELETE p',
      { patient_id }
    );
  } finally {
    await session.close();
  }
};



export default {
  getAllPatients,
  createPatient,
  deletePatient 
};

