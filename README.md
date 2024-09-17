# Biting Teacup Crappers

Biting Teacup Crappers (BTC) is a simple virtual pet game that interacts with the Bitcoin blockchain. In this game, your pet earns eggs based on Bitcoin mining activity. For each block mined on the Bitcoin network, your pet receives 1 egg for every 0.1 BTC mined in that block.

Live demo: [https://bitingteacupcrappers.com](https://bitingteacupcrappers.com)

## Tech Stack

- Frontend: React with TypeScript
- Framework: Next.js
- UI Library: Chakra UI
- Backend: Node.js
- Database: PostgreSQL with Prisma ORM
- Deployment: Vercel, with Heroku for Postgres
- Bitcoin Node: Chainstack

## Local Setup

To run this project locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/bl-nkd-v/biting-teacup-crappers
   cd biting-teacup-crappers
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Set up environment variables:
   Copy the `.env.example` file into your own `.env` file in the root directory and add the following variables:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name?schema=public
   BITCOIN_RPC_HOST=your_bitcoin_rpc_host
   BITCOIN_RPC_PORT=your_bitcoin_rpc_port
   BITCOIN_RPC_USER=your_bitcoin_rpc_user
   BITCOIN_RPC_PASS=your_bitcoin_rpc_pass
   ENV=development
   ```

4. Set up the database:

   ```
   npx prisma generate
   npx prisma migrate dev
   ```

5. Run the development server:

   ```
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the web app.

## To-Do

- [ ] Pet Art
  - [x] Pet Artwork Generation
  - [x] Traits
  - [ ] Rarity
- [ ] Stats for Pets
  - [x] Levels
  - [ ] Happiness
  - [ ] Upgrades
  - [x] Leaderboard for pets
- [ ] UI/UX
  - [ ] Proper auth
- [ ] Wallet Integration
  - [ ] Connect Wallet
  - [ ] Disconnect Wallet
  - [ ] (?) Tokenization of Pets

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
