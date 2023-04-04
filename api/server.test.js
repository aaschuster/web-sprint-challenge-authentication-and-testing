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

    await request(server).post("/api/auth/register").send({username: "billy", password: "pass"});
    expect(await db("users")).toHaveLength(5);

    await request(server).post("/api/auth/register").send({username: "paco", password: "pass"});
    expect(await db("users")).toHaveLength(6);
  })

  test('[4] response has id, username and passsword', async () => {
    let res = await request(server)
      .post("/api/auth/register")
      .send({username: "george", password: "pass"});

    expect(res.body.username).toBeTruthy();
    expect(res.body.password).toBeTruthy();
    expect(res.body.id).toBeTruthy();

    res = await request(server)
      .post("/api/auth/register")
      .send({username: "juan", password: "pass"});

    expect(res.body.username).toBeTruthy();
    expect(res.body.password).toBeTruthy();
    expect(res.body.id).toBeTruthy();

    res = await request(server)
      .post("/api/auth/register")
      .send({username: "paco", password: "pass"});

    expect(res.body.username).toBeTruthy();
    expect(res.body.password).toBeTruthy();
    expect(res.body.id).toBeTruthy();
  })

  test('[5] response password does not equal password send (response password is encrypted)', async () => {
    let res = await request(server)
      .post("/api/auth/register")
      .send({username: "george", password: "pass"});

    expect(res.body.password).not.toBe("pass");

    res = await request(server)
      .post("/api/auth/register")
      .send({username: "juan", password: "1234"});

    expect(res.body.password).not.toBe("1234");

    res = await request(server)
      .post("/api/auth/register")
      .send({username: "matthew", password: "matthew"});

    expect(res.body.password).not.toBe("matthew");
  })

  test('[6] responds with newly created user', async () => {
    let res = await request(server).post("/api/auth/register").send({username: "george", password: "pass"});
    expect(res.body).toMatchObject({username: "george"});

    res = await request(server).post("/api/auth/register").send({username: "matthew", password: "pass"});
    expect(res.body).toMatchObject({username: "matthew"});

    res = await request(server).post("/api/auth/register").send({username: "caleb", password: "pass"});
    expect(res.body).toMatchObject({username: "caleb"});
  })

  test('[7] new user is in db', async () => {
    let res = await request(server)
      .post("/api/auth/register")
      .send({username: "george", password: "pass"});

    let id = res.body.id;

    expect(res.body).toMatchObject(await db("users").where({id}).first());

    res = await request(server)
      .post("/api/auth/register")
      .send({username: "billy", password: "pass"});

    id = res.body.id;

    expect(res.body).toMatchObject(await db("users").where({id}).first());

    res = await request(server)
      .post("/api/auth/register")
      .send({username: "matthew", password: "pass"});

    id = res.body.id;

    expect(res.body).toMatchObject(await db("users").where({id}).first());

  })

})

describe("[POST] /api/auth/login", () => {
  test('[8] responds with "username and password required" if not provided', async () => {
    let res = await request(server).post("/api/auth/login");
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/login").send({username: "", password: "pass"})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/login").send({username: "     ", password: "pass"})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/login").send({username: "user", password: ""})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/login").send({username: "", password: ""})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/login").send({username: "user"})
    expect(res.body.message).toBe("username and password required");

    res = await request(server).post("/api/auth/login").send({password: "pass"})
    expect(res.body.message).toBe("username and password required");
  })

  test('[9] responds with "invalid credentials" if username is not in db', async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({username: "george", password: "pass"});

    expect(res.body.message).toBe("invalid credentials");

    res = await request(server)
      .post("/api/auth/login")
      .send({username: "juan", password: "pass"});

    expect(res.body.message).toBe("invalid credentials");
    
    res = await request(server)
      .post("/api/auth/login")
      .send({username: "joshua", password: "pass"});

    expect(res.body.message).toBe("invalid credentials");
  })

  test(`[10] responds with "invalid credentials" if password doesn't match`, async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({username: "aaron", password: "1234"})

    expect(res.body.message).toBe("invalid credentials");

    res = await request(server)
      .post("/api/auth/login")
      .send({username: "aaron", password: "aaron"})

    expect(res.body.message).toBe("invalid credentials");

    res = await request(server)
      .post("/api/auth/login")
      .send({username: "aaron", password: "password"})

    expect(res.body.message).toBe("invalid credentials");
  })

  test('[11] response has correct message if credentials are valid', async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({username: "aaron", password: "pass"});

    expect(res.body.message).toBe("welcome, aaron");

    res = await request(server)
    .post("/api/auth/login")
    .send({username: "mia", password: "pass"});

    expect(res.body.message).toBe("welcome, mia");

    res = await request(server)
      .post("/api/auth/login")
      .send({username: "tori", password: "pass"});

    expect(res.body.message).toBe("welcome, tori");
  })

  test('[12] response has token if credentials are valid', async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({username: "aaron", password: "pass"});

    expect(res.body.token).toBeTruthy();

    res = await request(server)
      .post("/api/auth/login")
      .send({username: "mia", password: "pass"});

    expect(res.body.token).toBeTruthy();

    res = await request(server)
      .post("/api/auth/login")
      .send({username: "tori", password: "pass"});

    expect(res.body.token).toBeTruthy();
  })
})
