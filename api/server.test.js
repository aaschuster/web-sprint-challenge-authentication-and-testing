const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async ()=> {
  await db.destroy();
})

describe("basic tests", () => {

  test('sanity', () => {
    expect(true).toBe(true)
  })

  test("environment is testing", () => expect(process.env.NODE_ENV).toBe("testing"));
})

describe("[POST] /api/auth/register", () => {
  test('responds with "username and password required" if not provided', async () => {
    const res = await request(server).post("/api/auth/register");
    expect(res.body.message).toBe("username and password required");
  })
})
