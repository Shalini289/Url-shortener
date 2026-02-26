import Url from "@/lib/Url";
import { flushClicks } from "@/lib/clickBuffer";
import { connectDB } from "@/lib/db";

let started = false;

export function startFlushWorker() {
  if (started) return;
  started = true;

  setInterval(async () => {
    await connectDB();
    await flushClicks(Url);
  }, 30000); // every 30 sec
}