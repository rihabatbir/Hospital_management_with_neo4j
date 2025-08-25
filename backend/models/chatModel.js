import driver from '../config/neo4j.js';

export const saveMessage = async ({ email, texte, type }) => {
  const session = driver.session();
  try {
    await session.run(
      `
      MERGE (u:User {email: $email})
      CREATE (m:Message {texte: $texte, type: $type, date: datetime()})
      MERGE (u)-[:A_ENVOYÉ]->(m)
      `,
      { email, texte, type }
    );
  } finally {
    await session.close();
  }
};
