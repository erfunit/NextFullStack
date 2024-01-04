import User from "@/models/User";
import ConnectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import cors from "cors";

const corsMiddleware = cors();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const corsPromise = new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  // Use await to ensure the CORS middleware completes
  try {
    await corsPromise;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", error: "Internal server error!!" });
    return;
  }

  try {
    await ConnectDB();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: "failed", error: "Internal server error!!" });
    return;
  }
  if (req.method === "POST") {
    const { name } = req.body;
    if (!name || !name.trim().length) {
      res.status(422).json({ status: "failed", error: "Name is required!" });
      return;
    }

    try {
      const user = await User.findOne({
        name: { $regex: new RegExp("^" + name + "$", "i") },
      });

      if (user) {
        res
          .status(422)
          .json({ status: "failed", error: "user already exists" });
        return;
      }

      await User.create({
        name,
      });
      res
        .status(201)
        .json({ status: "success", message: "Data created", data: { name } });
      console.log(name);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ status: "failed", error: "Failed in create data!" });
      return;
    }
  } else if (req.method === "GET") {
    try {
      const data = await User.find();
      res.status(422).json({ status: "OK", data });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", error: "error fetching users" });
    }
  } else if (req.method === "DELETE") {
    await User.deleteOne({ _id: req.body._id });
    res.status(200).json({ status: "OK", message: "User deleted" });
    try {
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", error: "error deleting user" });
    }
  } else if (req.method === "PUT") {
    try {
      await User.updateOne({ _id: req.body._id }, { name: req.body.name });
      res.status(200).json({ status: "OK", message: "User updated!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", error: "error updating user" });
    }
  } else {
    res.status(404).json({ error: "Method not allowed!" });
  }
}
