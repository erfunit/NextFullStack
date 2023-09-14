import fetchUsers from "@/utils/fetchUsers";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { FieldValues, useForm } from "react-hook-form";
import { LiaTimesSolid } from "react-icons/lia";

interface IUser {
  _id: string;
  name: string;
  createdAt: Date;
}

const Page = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  // const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<Array<IUser> | null>(null);
  const [editingItem, setEditingItem] = useState<string>("");

  const fetchData = async () => {
    const res = await fetchUsers();
    setUsers(res.data.reverse());
  };

  const onSubmit = async (formData: FieldValues) => {
    // e.preventDefault();
    const { name } = formData;
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
      reset();
      toast.success(data.message);
    }

    fetchData();
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
        toast.success(data.message);
      });

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onEditUser = (_id: string) => {
    console.log(_id);
    setEditingItem(_id);
  };

  const onEditComplete = async (_id: string, newName: string) => {
    const res = await fetch("/api/data", {
      method: "PUT",
      body: JSON.stringify({ _id, name: newName }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(data.message);
    }

    fetchData();
  };

  return (
    <div className="p-3 select-none">
      <h1 className="text-2xl font-semibold my-3">
        API AND DATABASE IN NEXT.js
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 mb-3 flex-col"
      >
        <div className="flex gap-2">
          <input
            className="bg-slate-100 p-2 rounded"
            type="text"
            {...register("name", {
              required: "Name is required!",
              minLength: {
                value: 3,
                message: "Name must be more than 3 characters",
              },
            })}
            placeholder="User name..."
          />
          <button
            disabled={isSubmitting}
            className="bg-blue-500 disabled:bg-gray-400 text-white p-2 rounded"
          >
            send
          </button>
        </div>
        {errors.name && (
          <span className="text-red-500">
            {errors.name.message?.toString()}
          </span>
        )}
      </form>
      <div className="flex gap-2 flex-col">
        {users?.map((item) => {
          return (
            <p
              onClick={() => onEditUser(item._id)}
              className="p-2 rounded bg-gray-100 flex justify-between"
              key={item._id}
            >
              <span
                contentEditable={item._id == editingItem}
                onBlur={(e) => {
                  onEditComplete(item._id, e.currentTarget.textContent || "");
                  setEditingItem(""); // stop editing after completion
                }}
              >
                {item.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item._id);
                }}
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
