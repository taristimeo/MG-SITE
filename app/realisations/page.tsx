import { redirect } from "next/navigation";

// L'ancien index des réalisations vit désormais dans le chutier complet.
export default function RealisationsIndex() {
  redirect("/films");
}
