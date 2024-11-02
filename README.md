# Transaction Management API

This project is for a technical test in which an API for managing transactions, where users can create transactions and administrators can validate or deny them. It has been built using **NestJS** and **TypeScript**, and it uses **MySQL** as the database, managed through **TypeORM**. **JWT** is also utilized for authentication, along with **Docker**.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Usage](#api-usage)
- [Testing](#testing)
- [Contributions](#contributions)
- [License](#license)

## Features

- User and administrator authentication.
- Transaction requests by authenticated users.
- Validation of transaction requests by administrators.
- Status updates of transactions (approved/denied).
- RESTful API.

## Requirements

- Node.js (v21)
- MySQL (v8)
- Docker

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Oladian/transactions-project.git
   ```

2. Use `docker-compose up` to launch the project.

3. Install the dependencies if you do not want to use Docker:
   ```bash
   npm install
   ```

4. A `.env` file is not necessary because it is included in the project, but you can modify it as you wish.

5. Run the application (if you did not use Docker):
   ```bash
   npm run start:dev
   ```

## Configuration

1. Make sure the `.env` file has the correct credentials for the database and the secret key for JWT.

## API Usage

### 1. Authentication

- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "username": "user",
    "password": "password"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token"
  }
  ```

### 2. Transaction Request

- **Endpoint**: `POST /transactions/request`
- **Body**:
  ```json
  {
    "amount": 100
  }
  ```
- **Response**:
  ```json
  {
    "no_response"
  }
  ```

### 3. Validate Transaction

- **Endpoint**: `POST /transactions/validate`
- **Body**:
  ```json
  {
    "transactionId": 1,
    "status": "approved" // or "rejected"
  }
  ```
- **Response**:
  ```json
  {
     "no_response"
  }
  ```

### 4. Get Pending Transactions

- **Endpoint**: `GET /transactions/pending`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "amount": 100,
      "status": "pending"
    }
  ]
  ```

## Testing

To run tests:

```bash
npm run test
```

You can also load the test suite, which will generate users and check the endpoints using sh.
```
./batch_test.sh
```

I used Thunder Client in Visual Studio Code to make the requests manually. You can import the `thunder-collection_Transactions.json` file into Thunder Client to perform the tests.

## License

This project is licensed under the **MIT License**. Please refer to the `LICENSE` file for more details.