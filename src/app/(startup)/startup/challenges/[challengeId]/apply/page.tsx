"use client";
import { useRouter } from "next/navigation";
import { useSession } from "@/store/useSession";
import { findStartupByUser } from "@/lib/mock-data";
import { ProposalModal } from "@/components/startup/ProposalModal";

export default function Apply({ params }: { params: { challengeId: string } }) {
  const router = useRouter();
  const challenge = useSession((s) => s.challenges.find((c) => c.id === params.challengeId));
  const me = findStartupByUser("u2");
  if (!challenge || !me) return <p role="alert">Challenge or startup profile not found.</p>;
  return <ProposalModal challenge={challenge} profile={me} onClose={() => router.push("/startup/challenges")} />;
}
