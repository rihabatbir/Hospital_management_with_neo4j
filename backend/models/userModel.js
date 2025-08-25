import driver from './neo4jDriver.js';

const findUserByEmail = async (email) => {
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (u:User {email: $email}) RETURN u LIMIT 1',
      { email }
    );
    if (result.records.length === 0) return null;

    const userNode = result.records[0].get('u').properties;
    return {
      email: userNode.email,
      password: userNode.password,
      role: userNode.role
    };
  } finally {
    await session.close();
  }
};

export default { findUserByEmail };
