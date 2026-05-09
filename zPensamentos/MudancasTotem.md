1. Mudança na Lógica de "Abertura de Mesa"

Atualmente, você provavelmente tem uma lista de mesas. Para o Totem, precisamos de um fluxo atômico:

Endpoint: POST /mesas/:id/totem-checkin

Corpo da Requisição: { nome_cliente: string, telefone: string }

Ação no Banco:

Verificar se a mesa ainda está DISPONIVEL (evitar que dois totens ocupem a mesma mesa ao mesmo tempo).

Gerar um token_acesso único e temporário.

Criar uma Comanda vinculada à mesa e aos dados do cliente.

Mudar o status da mesa para OCUPADA.

2. Segurança do Token

O QR Code não pode ser apenas o ID da mesa (ex: bar.com/mesa/5). Alguém poderia simplesmente mudar o número na URL e acessar a comanda de outra pessoa.

O token gerado pelo Totem deve ser validado em cada pedido.

3. WebSockets (Socket.io)

Para que a tela do Totem e o painel do Gestor atualizem instantaneamente quando uma mesa é ocupada, você precisará emitir um evento global no back-end sempre que o status de uma mesa mudar.


/**
 * Exemplo de implementação do Service para o fluxo do Totem
 * Este código deve ser adaptado para o seu mesas.service.ts
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // Para gerar tokens únicos

const prisma = new PrismaClient();

export class MesasService {
  async realizarCheckinTotem(mesaId: string, dados: { nome: string, telefone: string }) {
    // 1. Usamos uma transação para garantir que a mesa não seja ocupada por outro totem no mesmo milissegundo
    return await prisma.$transaction(async (tx) => {
      
      // 2. Busca a mesa e verifica disponibilidade
      const mesa = await tx.mesa.findUnique({ where: { id: mesaId } });
      
      if (!mesa || mesa.status !== 'DISPONIVEL') {
        throw new Error('Mesa não está disponível para ocupação.');
      }

      // 3. Gera tokens de sessão
      const tokenAcesso = uuidv4(); // Token que vai no QR Code
      const sessaoId = uuidv4();    // Identificador da sessão no banco

      // 4. Cria a Comanda e atualiza a Mesa simultaneamente
      const comanda = await tx.comanda.create({
        data: {
          mesa_id: mesaId,
          status: 'ABERTA',
          // Opcional: Criar um usuário "Visitante" ou salvar dados direto na comanda
          dados_cliente: {
            nome: dados.nome,
            telefone: dados.telefone
          }
        }
      });

      const mesaAtualizada = await tx.mesa.update({
        where: { id: mesaId },
        data: {
          status: 'OCUPADA',
          token_acesso: tokenAcesso,
          sessao_id: sessaoId
        }
      });

      // 5. Retorna os dados que o Totem precisa para montar a URL do QR Code
      return {
        mesa: mesaAtualizada.numero,
        token: tokenAcesso,
        comanda_id: comanda.id,
        url_acesso: `${process.env.APP_URL}/m/${mesaId}?t=${tokenAcesso}`
      };
    });
  }
}
-----------------------------------------------------------------------------------


