import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import dotenv from "dotenv";
import { Schema } from "mongoose";

dotenv.config();
const salt_round = process.env.SALT_ROUND;
require("chai").should();

describe("Endpoints", () => {
  const user = {
    name: "Emanuele",
    surname: "Moncada",
    email: "em@google.it",
    password: "itsstevejobs2012",
  };
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
});
