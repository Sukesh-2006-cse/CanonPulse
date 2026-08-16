"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ExecutiveSuiteDashboard } from "@/components/ExecutiveSuite/ExecutiveSuiteDashboard";

export default function ContinuityStudioPage() {
  const router = useRouter();

  const handleBackToLanding = () => {
    router.push("/");
  };

  return (
    <ExecutiveSuiteDashboard
      initialTab="continuitystudio"
      onBackToLanding={handleBackToLanding}
    />
  );
}
