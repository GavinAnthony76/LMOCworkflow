import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS workflow_sessions (
      week_id TEXT PRIMARY KEY,
      state JSONB NOT NULL DEFAULT '{}',
      session_notes TEXT NOT NULL DEFAULT '',
      session_info JSONB,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  await ensureTable();

  if (req.method === "GET") {
    const { weekId } = req.query;
    if (!weekId || typeof weekId !== "string") {
      return res.status(400).json({ error: "weekId required" });
    }

    const rows = await sql`
      SELECT state, session_notes, session_info, updated_at
      FROM workflow_sessions
      WHERE week_id = ${weekId}
    `;

    if (rows.length === 0) {
      return res.status(200).json({ weekId, state: {}, sessionNotes: "", sessionInfo: null });
    }

    const row = rows[0];
    return res.status(200).json({
      weekId,
      state: row.state,
      sessionNotes: row.session_notes,
      sessionInfo: row.session_info,
      updatedAt: row.updated_at,
    });
  }

  if (req.method === "PATCH") {
    const { weekId, state, sessionNotes, sessionInfo } = req.body;
    if (!weekId) return res.status(400).json({ error: "weekId required" });

    await sql`
      INSERT INTO workflow_sessions (week_id, state, session_notes, session_info, updated_at)
      VALUES (
        ${weekId},
        ${JSON.stringify(state ?? {})}::jsonb,
        ${sessionNotes ?? ""},
        ${sessionInfo ? JSON.stringify(sessionInfo) : null}::jsonb,
        NOW()
      )
      ON CONFLICT (week_id) DO UPDATE SET
        state = EXCLUDED.state,
        session_notes = EXCLUDED.session_notes,
        session_info = COALESCE(EXCLUDED.session_info, workflow_sessions.session_info),
        updated_at = NOW()
    `;

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
