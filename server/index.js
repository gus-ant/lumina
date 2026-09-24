import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(join(__dirname, 'reports.db'));

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    urgency TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    likes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Aberto',
    reporter TEXT DEFAULT 'usuario@aluno.unb.br',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed with initial data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM reports').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO reports (title, category, urgency, lat, lng, likes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run('Lâmpada queimada - Estacionamento UAC', 'Iluminação', 'Alta', -15.76289, -47.87198, 18, 'Aberto');
  insert.run('Rampa com defeito - ICC Norte', 'Acessibilidade', 'Crítica', -15.76410, -47.87050, 12, 'Em Análise');
  insert.run('Buraco na calçada - FGA', 'Infraestrutura', 'Média', -15.98960, -48.04426, 5, 'Resolvido');
  insert.run('Lâmpada UED - Bloco B', 'Iluminação', 'Baixa', -15.76350, -47.87250, 3, 'Resolvido');
}

// GET /api/reports - Return all reports
app.get('/api/reports', (req, res) => {
  const reports = db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all();
  res.json(reports);
});

// POST /api/reports - Create new report
app.post('/api/reports', (req, res) => {
  const { title, category, urgency, lat, lng } = req.body;
  if (!title || !category || !urgency || lat == null || lng == null) {
    return res.status(400).json({ error: 'Campos obrigatórios: title, category, urgency, lat, lng' });
  }
  const stmt = db.prepare(`
    INSERT INTO reports (title, category, urgency, lat, lng)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(title, category, urgency, lat, lng);
  const newReport = db.prepare('SELECT * FROM reports WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newReport);
});

// POST /api/reports/:id/like - Like a report
app.post('/api/reports/:id/like', (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body || {};

  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  if (!report) return res.status(404).json({ error: 'Reporte não encontrado' });

  if (userEmail && report.reporter === userEmail) {
    return res.status(403).json({ error: 'Você não pode confirmar seu próprio reporte!' });
  }

  db.prepare('UPDATE reports SET likes = likes + 1 WHERE id = ?').run(id);
  const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  res.json(updated);
});

// PUT /api/reports/:id - Edit a report
app.put('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, urgency, status, userEmail } = req.body || {};

  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  if (!report) return res.status(404).json({ error: 'Reporte não encontrado' });

  if (userEmail && report.reporter !== userEmail) {
    return res.status(403).json({ error: 'Apenas o autor pode editar esta ocorrência' });
  }

  const stmt = db.prepare(`
    UPDATE reports
    SET title = COALESCE(?, title),
        category = COALESCE(?, category),
        urgency = COALESCE(?, urgency),
        status = COALESCE(?, status)
    WHERE id = ?
  `);
  stmt.run(title, category, urgency, status, id);

  const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  res.json(updated);
});

// DELETE /api/reports/:id - Delete a report
app.delete('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const userEmail = req.query.userEmail;

  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  if (!report) return res.status(404).json({ error: 'Reporte não encontrado' });

  if (userEmail && report.reporter !== userEmail) {
    return res.status(403).json({ error: 'Apenas o autor pode apagar esta ocorrência' });
  }

  db.prepare('DELETE FROM reports WHERE id = ?').run(id);
  res.json({ success: true, id: Number(id) });
});

app.listen(PORT, () => {
  console.log(`✅ Lumina API rodando em http://localhost:${PORT}`);
});
