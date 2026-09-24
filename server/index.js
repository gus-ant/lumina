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
  db.prepare('UPDATE reports SET likes = likes + 1 WHERE id = ?').run(id);
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  res.json(report);
});

app.listen(PORT, () => {
  console.log(`✅ AcessaGama API rodando em http://localhost:${PORT}`);
});
