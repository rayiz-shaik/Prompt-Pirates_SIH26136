import { BlindScoring } from "@/components/evaluator/BlindScoring";
export default function ProposalEvaluation({ params }: { params: { id: string } }) { return <BlindScoring only={params.id} />; }
