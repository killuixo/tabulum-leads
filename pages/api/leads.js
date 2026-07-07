export default async function handler(req, res) {
  // Apenas aceita métodos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { password, action, payload } = req.body;

  // 1. Verifica se a senha enviada pelo App.jsx bate com a senha guardada no Vercel
  if (password !== process.env.TABULUM_PASSWORD) {
    return res.status(401).json({ message: 'Acesso Negado: Senha Incorreta' });
  }

  // 2. Resgata a URL secreta da planilha do Google
  const gasUrl = process.env.GAS_URL;

  if (!gasUrl) {
    return res.status(500).json({ message: 'Erro no servidor: GAS_URL não configurada.' });
  }

  try {
    // 3. Comunica com a planilha
    if (!action || action === 'get_all') {
      // Pede todas as linhas
      const response = await fetch(gasUrl);
      const data = await response.json();
      return res.status(200).json(data);
    } else if (action === 'update') {
      // Modifica uma linha (POST)
      const response = await fetch(gasUrl, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ message: 'Erro ao conectar com a base de dados (Planilha).' });
  }
}
