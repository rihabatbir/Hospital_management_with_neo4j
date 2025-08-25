import neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'neo4j')
);

const createTestUser = async () => {
  const session = driver.session();
  const email = "testuser@hopital.com";
  const password = "123456";
  const role = "patient";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log("📨 Insertion en cours...");
    await session.run(
      "CREATE (u:User {email: $email, password: $password, role: $role})",
      { email, password: hashedPassword, role }
    );
    console.log("✅ Utilisateur inséré avec succès !");
  } catch (err) {
    console.error("❌ Erreur pendant l'insertion :", err);
  } finally {
    await session.close();
    await driver.close();
  }
};

createTestUser();
