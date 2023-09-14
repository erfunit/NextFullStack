export default async function fetchUsers() {
  return (await fetch("/api/data")).json();
}
