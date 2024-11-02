#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
CONTENT_TYPE="Content-Type: application/json"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        echo -e "${RED}Response: $3${NC}"
        exit 1
    fi
}

echo "🚀 Starting API tests..."

# 1. Create admin user
echo -e "\n📝 Test: Creating admin user"
CREATE_ADMIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/create" \
    -H "${CONTENT_TYPE}" \
    -d '{
        "password": "admin123",
        "username": "Admin2",
        "role": "ADMIN"
    }')

print_result $? "Admin user created" "$CREATE_ADMIN_RESPONSE"

# 2. Login as admin
echo -e "\n🔐 Test: Admin login"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
    -H "${CONTENT_TYPE}" \
    -d '{
        "username": "admin",
        "password": "1234"
    }')

# Extract admin token
ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o 'access_token' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
    print_result 0 "Admin login successful - Token obtained" "$LOGIN_RESPONSE"
else
    print_result 1 "Admin login error" "$LOGIN_RESPONSE"
fi

# Create regular user
echo -e "\n📝 Test: Creating regular user"
CREATE_USER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/create" \
    -H "${CONTENT_TYPE}" \
    -d '{
        "password": "user123",
        "name": "Normal User",
        "role": "USER"
    }')

print_result $? "Regular user created" "$CREATE_USER_RESPONSE"

# Login as regular user
echo -e "\n🔐 Test: Regular user login"
USER_LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
    -H "${CONTENT_TYPE}" \
    -d '{
        "username": "Normal User",
        "password": "user123"
    }')

# Extract user token
USER_TOKEN=$(echo $USER_LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo -e "\n🔄 Starting transaction tests..."

# Test 1: Request transaction as regular user
echo -e "\n💰 Test: Request new transaction"
TRANSACTION_RESPONSE=$(curl -s -X POST "${API_URL}/transactions/request" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "${CONTENT_TYPE}" \
    -d '{
        "amount": 1000
    }')

# Extract transaction ID
TRANSACTION_ID=$(echo $TRANSACTION_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
print_result $? "Transaction requested" "$TRANSACTION_RESPONSE"

# Test 2: Get pending transactions as admin
echo -e "\n📋 Test: Get pending transactions (ADMIN)"
PENDING_RESPONSE=$(curl -s -X GET "${API_URL}/transactions/pending" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "${CONTENT_TYPE}")

print_result $? "Pending transactions retrieved" "$PENDING_RESPONSE"

# Test 3: Find specific transaction as admin
echo -e "\n🔍 Test: Find transaction by ID"
FIND_RESPONSE=$(curl -s -X GET "${API_URL}/transactions/find/$TRANSACTION_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "${CONTENT_TYPE}")

print_result $? "Transaction found" "$FIND_RESPONSE"

# Test 4: Validate transaction as admin
echo -e "\n✅ Test: Validate transaction"
VALIDATE_RESPONSE=$(curl -s -X PUT "${API_URL}/transactions/validate/$TRANSACTION_ID" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "${CONTENT_TYPE}" \
    -d '{
        "status": "APPROVED"
    }')

print_result $? "Transaction validated" "$VALIDATE_RESPONSE"

# Test 5: Try to access admin route with regular user (should fail)
echo -e "\n❌ Test: Verify access restriction"
UNAUTHORIZED_RESPONSE=$(curl -s -X GET "${API_URL}/transactions/pending" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "${CONTENT_TYPE}")

if [[ $UNAUTHORIZED_RESPONSE == *"Unauthorized"* ]]; then
    print_result 0 "Access restriction working correctly" "$UNAUTHORIZED_RESPONSE"
else
    print_result 1 "Access restriction failed" "$UNAUTHORIZED_RESPONSE"
fi

echo -e "\n✅ All tests completed!"