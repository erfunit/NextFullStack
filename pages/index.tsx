import fetchUsers from "@/utils/fetchUsers";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { LiaTimesSolid } from "react-icons/lia";

interface IUser {
  _id: string;
  name: string;
  createdAt: Date;
}

const Page = () => {
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<Array<IUser> | null>(null);

  const fetchData = async () => {
    const res = await fetchUsers();
    setUsers(res.data.reverse());
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/data", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    console.log(data.data);
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(data.message);
    }

    fetchData();

    setName(() => "");
  };

  const onDeleteItem = (_id: string) => {
    fetch("/api/data", {
      method: "DELETE",
      body: JSON.stringify({ _id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        toast(data.message);
      });

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold my-3">
        API AND DATABASE IN NEXT.js
      </h1>
      <form onSubmit={onSubmit} className="flex gap-2 mb-3">
        <input
          className="bg-slate-100 p-2 rounded"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded">send</button>
      </form>
      <div className="flex gap-2 flex-col">
        {users?.map((item) => {
          return (
            <p
              className="p-2 rounded bg-gray-100 flex justify-between"
              key={item._id}
            >
              <span>{item.name}</span>
              <button
                onClick={() => onDeleteItem(item._id)}
                className="h-6 w-6 flex justify-center items-center rounded-full bg-red-300 text-red-500"
              >
                <LiaTimesSolid size={14} />
              </button>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
