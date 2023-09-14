import React, { FormEvent, useState } from "react";

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
  };

  return (
    <div>
      <h1>API AND DATABASE IN NEXT.js</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button>send</button>
      </form>
    </div>
  );
};

export default Page;
