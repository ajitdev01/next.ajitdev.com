import { redirect } from "next/navigation";

export default function TestListRedirectPage() {
  redirect("/payments/test");
}
