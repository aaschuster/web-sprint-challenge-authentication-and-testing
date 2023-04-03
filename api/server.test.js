const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db.seed.run();
})

afterAll(async ()=> {
  await db.destroy();
})

describe("basic tests", () => {

  test('[0] sanity', () => {
    expect(true).toBe(true)
  })

  test("[0] environment is testing", () => expect(process.env.NODE_ENV).toBe("testing"));
})

describe("[POST] /api/auth/register", () => {

  test('[1] responds with "username and password required" if not provided', async () => {
    let res = await request(server).post("/api/auth/register");
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/register").send({username: "", password: "pass"})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/register").send({username: "     ", password: "pass"})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/register").send({username: "user", password: ""})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/register").send({username: "", password: ""})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/register").send({username: "user"})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/register").send({password: "pass"})
    expect(res.body.message).toBe("username and password required");
  })

  test('[2] responds with "username taken" if username is already in db', async () => {
    let res = await request(server).post("/api/auth/register").send({username: "aaron", password: "pass"});
    expect(res.body.message).toBe("username taken");

    res = await request(server).post("/api/auth/register").send({username: "tori", password: "pass"});
    expect(res.body.message).toBe("username taken");

    res = await request(server).post("/api/auth/register").send({username: "mia", password: "pass"});
    expect(res.body.message).toBe("username taken");
  })

  test('[3] users db is increased in length when valid user is entered', async () => {
    await request(server).post("/api/auth/register").send({username: "george", password: "pass"});
    expect(await db("users")).toHaveLength(4);
  })

})
