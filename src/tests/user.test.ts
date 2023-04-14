import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import dotenv from "dotenv";
import { Schema } from "mongoose";

dotenv.config();
const salt_round = Number(process.env.SALT_ROUND);
require("chai").should();

describe("Endpoints", () => {
  const user = {
    name: "Emanuele",
    surname: "Moncada",
    email: "em@google.it",
    password: "itsstevejobs2012",
  };

  // BLOCCO 01
  describe("Signup", () => {
    after(async () => {
      await User.deleteOne({ email: user.email });
    });

    // TEST 01
    it("Test [400] Wrong Email", async () => {
      const { status } = await request(app)
        .post("/signup")
        .send(
          User.findOneAndUpdate({ email: user.email }, { email: "wrong-email" })
        );
      status.should.be.equal(400);
    });

    //TEST 02
    it("Test [400] Missing Name", async () => {
      const userWithoutName = User.findOneAndUpdate(
        { email: user.email },
        { $unset: { name: 1 } }
      );
      const { status } = await request(app)
        .post("/signup")
        .send(userWithoutName);
      status.should.be.equal(400);
    });

    // TEST 03
    it("Test [400] Short Password", async () => {
      const userWithShortPassword = User.findOneAndUpdate(
        { email: user.email },
        { password: "12345" }
      );
      const { status } = await request(app)
        .post("/signup")
        .send(userWithShortPassword);
      status.should.be.equal(400);
    });

    // TEST 04
    it("Test [201] Signup", async () => {
      const { body, status } = await request(app).post("/signup").send(user);
      status.should.be.equal(201);
      body.should.have.property("id");
      body.should.have.property("name").equal(user.name);
      body.should.have.property("surname").equal(user.surname);
      body.should.have.property("email").equal(user.email);
      body.should.not.have.property("password");
      body.should.not.have.property("verify");
    });

    // TEST 05
    it("Test [409] Email is just present", async () => {
      const { status } = await request(app).post("/signup").send(user);
      status.should.be.equal(409);
    });
  });

  // BLOCCO 02
  describe("Validate", () => {
    let newUser: IUser;
    before(async () => {
      newUser = {
        name: "Carlo",
        surname: "Leonardi",
        email: "carloleonardi83@gmail.com",
        password: "cript-password",
        verify: uuidv4(),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("Test [400] Invalid token", async () => {
      const { status } = await request(app).get(`/validate/fake-token`);
      status.should.be.equal(400);
    });

    // TEST 02
    it.skip("Test [200] Set token", async () => {
      const { status } = await request(app).get(`/validate/${newUser.verify}`);
      console.log("01", newUser.verify);
      status.should.be.equal(200);
      console.log("02", newUser.verify);
      const userFinded = await User.findOne({ email: newUser.email });
      userFinded!.should.not.have.property("verify");
    });
  });

  // BLOCCO 03
  describe("Login", () => {
    let newUser: IUser;
    let password = "password";
    before(async () => {
      newUser = {
        name: "Carlo",
        surname: "Leonardi",
        email: "carloleonardi83@gmail.com",
        password: await bcrypt.hash(password, salt_round),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("Test [400] Wrong data", async () => {
      const { status } = await request(app)
        .post(`/login`)
        .send({ email: "wrongmail", password: "A simple password" });
      status.should.be.equal(400);
    });

    // TEST 02
    it("Test [401] Invalid credentials", async () => {
      const { status } = await request(app)
        .post(`/login`)
        .send({ email: newUser.email, password: "wrong-password" });
      status.should.be.equal(401);
    });

    //TEST 03
    it("Test [200] Login success", async () => {
      const { status, body } = await request(app)
        .post(`/login`)
        .send({ email: newUser.email, password });
      status.should.be.equal(200);
      body.should.have.property("token");
    });
  });

  // BLOCCO 04
  describe("Login with not confirmed user", () => {
    let newUser: IUser;
    let password = "password";
    before(async () => {
      newUser = {
        name: "Carlo",
        surname: "Leonardi",
        email: "carloleonardi83@gmail.com",
        password: await bcrypt.hash(password, salt_round),
        verify: uuidv4(),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("Test [401] Login not success (while email is not verified)", async () => {
      const { status } = await request(app)
        .post(`/login`)
        .send({ email: newUser.email, password });
      status.should.be.equal(401);
    });
  });

  // BLOCCO 05
  describe("Me", () => {
    let newUser: IUser;
    let password = "password";
    before(async () => {
      newUser = {
        name: "Carlo",
        surname: "Leonardi",
        email: "carloleonardi83@gmail.com",
        password: await bcrypt.hash(password, salt_round),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("Test [400] Token wrong", async () => {
      const { status } = await request(app)
        .post(`/login`)
        .set({ authorization: "wrong-token" });
      status.should.be.equal(400);
    });

    // TEST 02
    it("Test [200] Token rigth", async () => {
      const {
        body: { token },
      } = await request(app)
        .post(`/login`)
        .send({ email: newUser.email, password });

      const { body } = await request(app)
        .get("/me")
        .set({ authorization: token });
      body.should.have.property("_id");
      body.should.have.property("name").equal(newUser.name);
      body.should.have.property("surname").equal(newUser.surname);
      body.should.have.property("email").equal(newUser.email);
      body.should.not.have.property("password");
      body.should.not.have.property("verify");
    });
  });
});
