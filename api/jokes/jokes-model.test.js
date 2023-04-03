const Jokes = require("./jokes-model");
const db = require("../../data/dbConfig");

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
})

afterAll(async ()=> {
    await db.destroy()
})

describe("basic checks", () => {
    test("sanity", () => expect(1).toBe(1));
    
    test("environment is testing", () => expect(process.env.NODE_ENV).toBe("testing"));
})