import db from "@/lib/db";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { collectCandidates } from "./feedbackAggregator";

const TRAINING_SERVICE_URL = process.env.TRAINING_SERVICE_URL || "http://localhost:8000";

export async function scheduleRetrainIfNeeded({ minSamples = 200, triggeredBy = "auto" } = {}) {
  return { queued: false, reason: "phase1-stub" };
}
