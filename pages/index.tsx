import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [name, setName] = useState<string>("");

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
  };

  return (
    <div>
      <h1>API AND DATABASE IN NEXT.js</h1>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="bg-slate-100 p-2 rounded"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded">send</button>
      </form>
    </div>
  );
};

export default Page;
