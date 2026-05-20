import { redirect } from "next/navigation";

// Root URL — redirect to login. Protected pages handle their own role routing.
export default function RootPage() {
  redirect("/login");
}
