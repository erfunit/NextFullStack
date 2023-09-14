import User from "@/models/User";
import ConnectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      const user = await User.findOne({ name });

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
  } else {
    res.status(400).json({ error: "Method not allowed!" });
  }
}
