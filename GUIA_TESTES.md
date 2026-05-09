# 🧪 Guia de Testes - Sistema de Mesas com QR Code

## Pré-requisitos
- Backend rodando: `npm run dev` na porta 3000
- Bruno ou Postman aberto
- Database Supabase ativa
- Usuário autenticado (token JWT)

---

## 1️⃣ Testes de QR Code & Mesas

### 1.1 Gerar QR Code para Mesa
**Endpoint**: `GET /mesas/:mesa_id/qrcode`
**Autenticação**: SIM (Bearer token)

**Request**:
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3000/mesas/{mesa_id}/qrcode
```

**Resposta Esperada** (200):
```json
{
  "success": true,
  "data": {
    "numero": 1,
    "token": "abc123def456...",
    "url": "http://localhost:3000/m/1?t=abc123def456...",
    "expira_em": "2024-01-15T10:30:00Z"
  }
}
```

---

### 1.2 Abrir Mesa com Token
**Endpoint**: `POST /mesas/:mesa_id/abrir-com-token`
**Autenticação**: NÃO (Cliente escaneia QR)

**Request Body**:
```json
{
  "token": "abc123def456...",
  "numero": 1
}
```

**Resposta Esperada** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numero": 1,
    "status": "OCUPADA",
    "sessao_id": "uuid",
    "comanda": { "id": "uuid", "status": "ABERTA" }
  }
}
```

---

### 1.3 Validar Token de Acesso
**Endpoint**: `GET /mesas/:mesa_id/validar-token?token=abc123...`
**Autenticação**: NÃO

**Resposta Esperada** (200):
```json
{
  "success": true,
  "valid": true,
  "comanda_id": "uuid",
  "expira_em": "2024-01-15T10:30:00Z"
}
```

---

## 2️⃣ Testes de Comandas

### 2.1 Criar Comanda
**Endpoint**: `POST /comandas`
**Autenticação**: SIM

**Request Body**:
```json
{
  "mesa_id": "uuid-da-mesa",
  "usuario_id": "uuid-do-usuario-opcional"
}
```

**Resposta Esperada** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "mesa_id": "uuid",
    "status": "ABERTA",
    "total": 0,
    "criado_em": "2024-01-15T10:00:00Z"
  }
}
```

---

### 2.2 Obter Comanda Ativa da Mesa
**Endpoint**: `GET /comandas/mesa/:mesa_id/ativa`
**Autenticação**: SIM

**Resposta Esperada** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "mesa_id": "uuid",
    "status": "ABERTA",
    "total": 150.50,
    "mesa": { "numero": 1 }
  }
}
```

---

### 2.3 Adicionar Produto à Comanda
**Endpoint**: `POST /comandas/:comanda_id/produtos`
**Autenticação**: SIM

**Request Body**:
```json
{
  "produto_id": "uuid-do-produto",
  "quantidade": 2
}
```

**Resposta Esperada** (201):
```json
{
  "success": true,
  "data": {
    "id": "item-uuid",
    "produto_id": "uuid",
    "quantidade": 2,
    "preco_snapshot": 45.99,
    "subtotal": 91.98,
    "produto": {
      "id": "uuid",
      "nome": "Refrigerante",
      "preco_unitario": 45.99
    }
  }
}
```

---

### 2.4 Listar Pedidos da Comanda
**Endpoint**: `GET /comandas/:comanda_id/pedidos`
**Autenticação**: SIM

**Resposta Esperada** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "pedido-uuid",
      "mesa_id": "uuid",
      "valor_total": 91.98,
      "status_preparo": "PENDENTE",
      "itens": [
        {
          "id": "item-uuid",
          "produto_id": "uuid",
          "quantidade": 2,
          "preco_snapshot": 45.99,
          "subtotal": 91.98,
          "produto": { "nome": "Refrigerante" }
        }
      ]
    }
  ]
}
```

---

### 2.5 Remover Item da Comanda
**Endpoint**: `DELETE /comandas/item/:item_id`
**Autenticação**: SIM

**Resposta Esperada** (200):
```json
{
  "success": true,
  "message": "Item removido"
}
```

---

### 2.6 Finalizar Comanda
**Endpoint**: `POST /comandas/:comanda_id/finalizar`
**Autenticação**: SIM

**Request Body**:
```json
{
  "metodo_pagamento": "CARTAO"
}
```

**Resposta Esperada** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "FINALIZADA",
    "total": 91.98,
    "finalizado_em": "2024-01-15T10:30:00Z"
  }
}
```

---

## 3️⃣ Testes de Hardware (ESP32)

### 3.1 Registrar Dispositivo
**Endpoint**: `POST /hardware/device/register`
**Autenticação**: NÃO (IoT device)

**Request Body**:
```json
{
  "mesa_id": "uuid-da-mesa",
  "device_id": "ESP32_001"
}
```

**Resposta Esperada** (201):
```json
{
  "success": true,
  "message": "Dispositivo registrado com sucesso",
  "device_id": "ESP32_001"
}
```

---

### 3.2 Obter Status da Mesa (para ESP32)
**Endpoint**: `GET /hardware/mesa/:numero/status`
**Autenticação**: NÃO

**Resposta Esperada** (200) - Formato compacto:
```json
{
  "success": true,
  "data": {
    "id": "mesa-uuid",
    "st": "OCUPADA",
    "tk": "token-abreviado",
    "url": "http://localhost:3000/m/1?t=...",
    "num": 1,
    "cap": 4,
    "upd": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3.3 Processar Evento de Hardware
**Endpoint**: `POST /hardware/mesa/:mesa_id/evento`
**Autenticação**: NÃO

**Request Body**:
```json
{
  "device_id": "ESP32_001",
  "tipo": "CHAMAR_GARCOM"
}
```

**Resposta Esperada** (200):
```json
{
  "success": true,
  "message": "Evento registrado",
  "evento": {
    "id": "uuid",
    "mesa_id": "uuid",
    "tipo": "CHAMAR_GARCOM",
    "device_id": "ESP32_001",
    "criado_em": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3.4 Listar Eventos Recentes
**Endpoint**: `GET /hardware/mesa/:mesa_id/eventos`
**Autenticação**: NÃO

**Resposta Esperada** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "mesa_id": "uuid",
      "tipo": "CHAMAR_GARCOM",
      "device_id": "ESP32_001",
      "criado_em": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "mesa_id": "uuid",
      "tipo": "LIMPEZA_INICIADA",
      "device_id": "ESP32_001",
      "criado_em": "2024-01-15T10:25:00Z"
    }
  ]
}
```

---

## 4️⃣ Testes de Fluxo Completo

### Cenário: Cliente Escaneia QR → Abre Mesa → Faz Pedido → Fecha Mesa

#### Passo 1: Gerente gera QR Code
```bash
# Login e obter JWT
POST /auth/login
{
  "email": "gerente@restaurant.com",
  "password": "senha"
}
# Token retornado

# Gerar QR para mesa 1
GET /mesas/{mesa_1_id}/qrcode
# Resposta com URL de QR
```

#### Passo 2: Cliente escaneia QR (sem autenticação)
```bash
# Extrair token da URL
POST /mesas/{mesa_1_id}/abrir-com-token
{
  "token": "abc123...",
  "numero": 1
}
# Retorna comanda aberta
```

#### Passo 3: Cliente adiciona produtos (sem autenticação via token de mesa)
```bash
# Comanda agora ativa, cliente faz pedidos
POST /comandas/{comanda_id}/produtos
{
  "produto_id": "uuid_agua",
  "quantidade": 1
}

POST /comandas/{comanda_id}/produtos
{
  "produto_id": "uuid_pizza",
  "quantidade": 1
}
```

#### Passo 4: Visualizar total
```bash
GET /comandas/{comanda_id}/pedidos
# Mostra todos os pedidos com itemization e total
```

#### Passo 5: Finalizar comanda
```bash
POST /comandas/{comanda_id}/finalizar
{
  "metodo_pagamento": "PIX"
}
```

#### Passo 6: Fechar mesa
```bash
POST /mesas/{mesa_id}/fechar-com-evento
{
  "tipo": "MESA_FECHADA"
}
# Mesa volta para DISPONIVEL, token zerado
```

---

## 5️⃣ Testes de Erro (Edge Cases)

### 5.1 Token Expirado
**Teste**: Esperar 360+ minutos e tentar usar token
**Esperado**: 401 Unauthorized

### 5.2 Mesa Já Ocupada
**Teste**: Tentar `abrir-com-token` em mesa já ocupada
**Esperado**: 400 - "Mesa já está ocupada"

### 5.3 Comanda Sem Itens
**Teste**: Finalizar comanda vazia
**Esperado**: 200 (permitir finalizar, mas total = 0)

### 5.4 Produto Não Existe
**Teste**: Adicionar produto_id inválido
**Esperado**: 404 - "Produto não encontrado"

### 5.5 Quantidade Negativa
**Teste**: POST com quantidade: -5
**Esperado**: 400 - Erro de validação Zod

---

## 📊 Exemplo de Bruno Collection

```yaml
@baseUrl = http://localhost:3000

### Auth
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "gerente@restaurant.com",
  "password": "senha"
}

### Gerar QR (com token JWT)
GET {{baseUrl}}/mesas/{{mesa_id}}/qrcode
Authorization: Bearer {{jwt_token}}

### Abrir Mesa (sem auth)
POST {{baseUrl}}/mesas/{{mesa_id}}/abrir-com-token
Content-Type: application/json

{
  "token": "{{qr_token}}",
  "numero": 1
}

### Criar Comanda (com JWT)
POST {{baseUrl}}/comandas
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "mesa_id": "{{mesa_id}}"
}

### Adicionar Produto
POST {{baseUrl}}/comandas/{{comanda_id}}/produtos
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
  "produto_id": "{{produto_id}}",
  "quantidade": 1
}
```

---

## ✅ Checklist de Validação

- [ ] QR Code gerado com token válido
- [ ] Mesa abre corretamente com token
- [ ] Comanda criada automaticamente ao abrir mesa
- [ ] Produtos adicionados com cálculo correto
- [ ] Total da comanda atualizado dinamicamente
- [ ] Items removidos recalculam total
- [ ] Hardware consegue registrar eventos
- [ ] ESP32 recebe status em formato compacto
- [ ] Finalizar comanda muda status
- [ ] Fechar mesa zera token
- [ ] Histórico de comandas armazenado
- [ ] Validação de erro para casos inválidos
- [ ] Compilação TypeScript sem erros

---

**Sistema pronto para validação!** 🚀
