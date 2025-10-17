const getUsers = async () => {
  const res = await fetch("/api/users", {
    cache: "no-store",
  });
  // console.log("Fetching users from /api/users", res);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

export { getUsers };

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type Profiles = Profile[];
