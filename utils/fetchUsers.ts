export default async function fetchUsers() {
  return (await fetch("/api/data", { cache: "no-store" })).json();
}
