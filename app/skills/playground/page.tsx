import { redirect } from "next/navigation";

// The playground was never built. A 404 behind a nav item is a broken promise
// and a "coming soon" page is a surface with nothing in it, so an old link
// lands on the catalog instead.
export default function PlaygroundPage() {
  redirect("/skills");
}
