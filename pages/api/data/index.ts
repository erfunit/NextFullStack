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
      .json({ status: "failed", message: "Internal server error!" });
    return;
  }
  if (req.method === "POST") {
    const { name } = req.body;
    if (!name || !name.trim().length) {
      res.status(422).json({ status: "failed", error: "Name is required!" });
      return;
    }

    await User.create({
      name,
    });
    res
      .status(201)
      .json({ status: "success", message: "Data created", data: { name } });
    console.log(name);
  } else {
    res.status(400).json({ error: "Method not allowed!" });
  }
}
