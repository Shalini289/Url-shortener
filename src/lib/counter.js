import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 100000 },
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}