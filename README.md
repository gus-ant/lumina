# 🌟 Lumina — Mapeamento Colaborativo e Engajamento Cívico

> **Lumina** é uma plataforma *mobile-first* de crowdsourcing cívico que conecta a comunidade universitária e cidadãos à gestão do espaço público, promovendo a resolução colaborativa de problemas de infraestrutura, acessibilidade e segurança.

---

## 🎯 Nossa Missão

Nossa missão é transformar a maneira como as pessoas se relacionam com o seu ambiente. Através do mapeamento georreferenciado e da participação comunitária, o **Lumina** dá voz aos cidadãos para reportar, validar e acompanhar a resolução de ocorrências de forma simples, transparente e em tempo real.

---

## 💡 Problemas que Resolvemos

1. **Falta de Comunicação Direta**: Elimina a burocracia no reporte de falhas urbanas (lâmpadas queimadas, rampas inacessíveis, buracos e problemas de segurança).
2. **Ausência de Dados Georreferenciados**: Fornece coordenadas exatas de latitude e longitude no mapa para que equipes de manutenção encontrem a ocorrência sem ambiguidades.
3. **Falta de Priorização Comunitária**: Introduz o botão *"Eu Também Vi / Confirmar"*, permitindo que a própria comunidade valide a relevância e urgência de um problema.
4. **Falta de Transparência no Status**: Permite acompanhar o ciclo de vida completo de cada ocorrência (*Aberto*, *Em Análise*, *Resolvido*).

---

## 📱 Funcionalidades Principais

- 📍 **Mapa Interativo (OpenStreetMap / Leaflet)**: Navegação global com marcadores coloridos baseados no status e grau de urgência.
- ➕ **Reporte Instantâneo**: Clique em qualquer ponto do mapa para abrir o formulário *Bottom Sheet* e enviar o reporte em poucos segundos.
- 👍 **Validação Social ("Eu Também Vi")**: Sistema de confirmação de problemas por outros usuários com contador de engajamento em tempo real.
- 🏆 **Gamificação e Níveis**: Sistema de pontos e níveis (ex: *Nível 2: Guardião do Campus*) para incentivar a participação contínua.
- 📊 **Gestão de Ocorrências**: Visualização de reportes recentes e filtro por categorias (*Iluminação, Acessibilidade, Segurança, Infraestrutura, Limpeza*).

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React-Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/)
- [Lucide React](https://lucide.dev/) (Ícones)

### **Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) (Banco de dados relacional e ultrarrápido)
- [Concurrently](https://github.com/open-cli-tools/concurrently) (Execução simultânea do frontend e backend)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/gus-ant/acessa-gama.git
   cd acessa-gama
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie a aplicação (Frontend + Backend):**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   - 📱 **Frontend**: `http://localhost:5173`
   - ⚙️ **API REST**: `http://localhost:3001/api/reports`

---

## 📌 Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/reports` | Retorna todas as ocorrências salvas |
| `POST` | `/api/reports` | Cria um novo reporte (`{ title, category, urgency, lat, lng }`) |
| `POST` | `/api/reports/:id/like` | Incrementa o contador de confirmações de uma ocorrência |

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para contribuir!
