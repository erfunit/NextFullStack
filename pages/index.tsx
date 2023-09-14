import fetchUsers from "@/utils/fetchUsers";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { FieldValues, useForm } from "react-hook-form";
import { LiaTimesSolid } from "react-icons/lia";

import { zodResolver } from "@hookform/resolvers/zod";
import z, { TypeOf } from "zod";

interface IUser {
  _id: string;
  name: string;
  createdAt: Date;
}

const formSchema = z.object({
  name: z.string().min(3, "Name must be more than 3 characters"),
});

type TFromSchema = z.infer<typeof formSchema>;

type ReqMethod = "GET" | "PUT" | "POST" | "DELETE";

const makeRequest = async (method: ReqMethod, body: object) => {
  const response = await fetch("/api/data", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
};

const Page = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TFromSchema>({
    resolver: zodResolver(formSchema),
  });
  // const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<Array<IUser> | null>(null);
  const [editingItem, setEditingItem] = useState<string>("");

  const fetchData = async () => {
    const res = await fetchUsers();
    setUsers(res.data.reverse());
  };

  // CHANGES:
  const onSubmit = async (formData: FieldValues) => {
    const data = await makeRequest("POST", { name: formData.name });

    if (data.error) {
      toast.error(data.error);
    } else {
      reset();
      setUsers((prevUsers) => [data.data, ...prevUsers!]);
      toast.success(data.message);
    }
  };

  const onDeleteItem = async (_id: string) => {
    const data = await makeRequest("DELETE", { _id });
    toast.success(data.message);

    setUsers((prevUsers) => prevUsers!.filter((user) => user._id !== _id));
  };

  const onEditComplete = async (_id: string, newName: string) => {
    const data = await makeRequest("PUT", { _id, name: newName });

    if (data.error) {
      toast.error(data.error);
    } else {
      setUsers((prevUsers) => {
        return prevUsers!.map((user) =>
          user._id === _id ? { ...user, name: newName } : user
        );
      });
      toast.success(data.message);
    }
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
