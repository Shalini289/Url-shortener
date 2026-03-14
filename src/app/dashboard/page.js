export const dynamic = "force-dynamic";
import Url from "@/lib/Url";
import { connectDB } from "@/lib/db";


export default async function Dashboard() {
  await connectDB();
  const urls = await Url.find().sort({ createdAt: -1 }).lean();

  return (
    <div style={{ padding: 40 }}>
      <h1>📊 Analytics Dashboard</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Short</th>
            <th>Original</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u) => (
            <tr key={u._id}>
              <td>{u.shortCode}</td>
              <td>{u.longUrl}</td>
              <td>{u.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}