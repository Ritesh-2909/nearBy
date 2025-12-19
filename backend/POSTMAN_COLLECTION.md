# Postman Collection - NearBy Backend API

Base URL: `http://localhost:5005/api`

## Setup Instructions

1. Import these curl commands into Postman
2. Set environment variable `baseUrl` = `http://localhost:5005/api`
3. Set environment variable `token` = (your JWT token after login)
4. Replace `{{baseUrl}}` and `{{token}}` in requests

---

## 1. Health Check

### Health Check
```bash
curl --location 'http://localhost:5005/api/health'
```

---

## 2. Authentication Routes (`/api/auth`)

### Register User
```bash
curl --location 'http://localhost:5005/api/auth/register' \
--header 'Content-Type: application/json' \
--data '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}'
```

### Login User
```bash
curl --location 'http://localhost:5005/api/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "email": "john@example.com",
    "password": "password123"
}'
```

### Get Current User (Requires Auth)
```bash
curl --location 'http://localhost:5005/api/auth/me' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### Create Anonymous User
```bash
curl --location 'http://localhost:5005/api/auth/anonymous' \
--header 'Content-Type: application/json'
```

---

## 3. Vendor Routes (`/api/vendors`)

### Get Nearby Vendors
```bash
curl --location 'http://localhost:5005/api/vendors/nearby?lat=28.6139&lng=77.2090&radius=3000&category=Grocery&search=grocery'
```

### Get Nearby Vendors (Minimal)
```bash
curl --location 'http://localhost:5005/api/vendors/nearby?lat=28.6139&lng=77.2090'
```

### Get Vendor by ID
```bash
curl --location 'http://localhost:5005/api/vendors/VENDOR_ID'
```

### Get Vendor by ID (With Auth)
```bash
curl --location 'http://localhost:5005/api/vendors/VENDOR_ID' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### Submit New Vendor (Requires Auth)
```bash
curl --location 'http://localhost:5005/api/vendors/user-submissions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN' \
--data '{
    "name": "New Grocery Store",
    "category": "Grocery",
    "description": "Fresh vegetables and daily essentials",
    "tags": ["fresh", "organic", "vegetables"],
    "location": {
        "lat": 28.6139,
        "lng": 77.2090
    },
    "address": "123 Main Street, City",
    "phone": "+91-1234567890",
    "openingHours": {
        "monday": "9:00-18:00",
        "tuesday": "9:00-18:00",
        "wednesday": "9:00-18:00",
        "thursday": "9:00-18:00",
        "friday": "9:00-18:00",
        "saturday": "9:00-18:00",
        "sunday": "closed"
    },
    "photo": "https://example.com/photo.jpg"
}'
```

### Get My Submissions (Requires Auth)
```bash
curl --location 'http://localhost:5005/api/vendors/my-submissions' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### Get Categories List
```bash
curl --location 'http://localhost:5005/api/vendors/categories/list'
```

### Increment Click Count
```bash
curl --location --request POST 'http://localhost:5005/api/vendors/VENDOR_ID/click' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

---

## 4. Admin Routes (`/api/admin`) - Requires Admin Auth

### Get All Submissions
```bash
curl --location 'http://localhost:5005/api/admin/submissions?status=pending' \
--header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN'
```

### Get All Submissions (All Statuses)
```bash
curl --location 'http://localhost:5005/api/admin/submissions?status=all' \
--header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN'
```

### Approve Submission
```bash
curl --location --request POST 'http://localhost:5005/api/admin/submissions/VENDOR_ID/approve' \
--header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN'
```

### Reject Submission
```bash
curl --location --request POST 'http://localhost:5005/api/admin/submissions/VENDOR_ID/reject' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN' \
--data '{
    "reason": "Duplicate vendor or inappropriate content"
}'
```

### Edit and Approve Submission
```bash
curl --location --request PUT 'http://localhost:5005/api/admin/submissions/VENDOR_ID' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN' \
--data '{
    "name": "Updated Vendor Name",
    "category": "Grocery",
    "description": "Updated description",
    "tags": ["fresh", "organic"],
    "address": "Updated address",
    "phone": "+91-9876543210",
    "openingHours": {
        "monday": "8:00-20:00"
    },
    "photo": "https://example.com/new-photo.jpg"
}'
```

### Create Vendor (Admin)
```bash
curl --location 'http://localhost:5005/api/admin/vendors' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN' \
--data '{
    "name": "Admin Created Vendor",
    "category": "Food",
    "description": "Vendor created by admin",
    "tags": ["restaurant", "dine-in"],
    "location": {
        "lat": 28.6139,
        "lng": 77.2090
    },
    "address": "456 Admin Street",
    "phone": "+91-1111111111",
    "openingHours": {
        "monday": "10:00-22:00"
    },
    "photo": "https://example.com/vendor.jpg"
}'
```

### Get Analytics
```bash
curl --location 'http://localhost:5005/api/admin/analytics' \
--header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN'
```

---

## 5. Test/Mock Routes (`/api/test`)

### Test Health Check
```bash
curl --location 'http://localhost:5005/api/test/health'
```

### Get Mock Vendors
```bash
curl --location 'http://localhost:5005/api/test/mock-vendors'
```

### Get Mock Nearby Vendors
```bash
curl --location 'http://localhost:5005/api/test/mock-nearby?lat=28.6139&lng=77.2090&radius=5000'
```

### Mock Login
```bash
curl --location --request POST 'http://localhost:5005/api/test/mock-login' \
--header 'Content-Type: application/json'
```

### Get Mock Categories
```bash
curl --location 'http://localhost:5005/api/test/mock-categories'
```

### Get Mock Analytics
```bash
curl --location 'http://localhost:5005/api/test/mock-analytics'
```

### Test Delay
```bash
curl --location 'http://localhost:5005/api/test/delay?ms=2000'
```

---

## Postman Collection JSON

Here's a ready-to-import Postman Collection JSON:

```json
{
	"info": {
		"name": "NearBy Backend API",
		"description": "Complete API collection for NearBy vendor management system",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"variable": [
		{
			"key": "baseUrl",
			"value": "http://localhost:5005/api",
			"type": "string"
		},
		{
			"key": "token",
			"value": "",
			"type": "string"
		}
	],
	"item": [
		{
			"name": "Health Check",
			"item": [
				{
					"name": "Health Check",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/health",
							"host": ["{{baseUrl}}"],
							"path": ["health"]
						}
					}
				}
			]
		},
		{
			"name": "Authentication",
			"item": [
				{
					"name": "Register",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"John Doe\",\n    \"email\": \"john@example.com\",\n    \"password\": \"password123\"\n}"
						},
						"url": {
							"raw": "{{baseUrl}}/auth/register",
							"host": ["{{baseUrl}}"],
							"path": ["auth", "register"]
						}
					}
				},
				{
					"name": "Login",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"if (pm.response.code === 200) {",
									"    var jsonData = pm.response.json();",
									"    pm.environment.set(\"token\", jsonData.token);",
									"}"
								]
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\": \"john@example.com\",\n    \"password\": \"password123\"\n}"
						},
						"url": {
							"raw": "{{baseUrl}}/auth/login",
							"host": ["{{baseUrl}}"],
							"path": ["auth", "login"]
						}
					}
				},
				{
					"name": "Get Current User",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/auth/me",
							"host": ["{{baseUrl}}"],
							"path": ["auth", "me"]
						}
					}
				},
				{
					"name": "Create Anonymous User",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/auth/anonymous",
							"host": ["{{baseUrl}}"],
							"path": ["auth", "anonymous"]
						}
					}
				}
			]
		},
		{
			"name": "Vendors",
			"item": [
				{
					"name": "Get Nearby Vendors",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/vendors/nearby?lat=28.6139&lng=77.2090&radius=3000",
							"host": ["{{baseUrl}}"],
							"path": ["vendors", "nearby"],
							"query": [
								{
									"key": "lat",
									"value": "28.6139"
								},
								{
									"key": "lng",
									"value": "77.2090"
								},
								{
									"key": "radius",
									"value": "3000"
								},
								{
									"key": "category",
									"value": "Grocery",
									"disabled": true
								},
								{
									"key": "search",
									"value": "grocery",
									"disabled": true
								}
							]
						}
					}
				},
				{
					"name": "Get Vendor by ID",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/vendors/:id",
							"host": ["{{baseUrl}}"],
							"path": ["vendors", ":id"],
							"variable": [
								{
									"key": "id",
									"value": "VENDOR_ID"
								}
							]
						}
					}
				},
				{
					"name": "Submit Vendor",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"New Grocery Store\",\n    \"category\": \"Grocery\",\n    \"description\": \"Fresh vegetables and daily essentials\",\n    \"tags\": [\"fresh\", \"organic\"],\n    \"location\": {\n        \"lat\": 28.6139,\n        \"lng\": 77.2090\n    },\n    \"address\": \"123 Main Street\",\n    \"phone\": \"+91-1234567890\"\n}"
						},
						"url": {
							"raw": "{{baseUrl}}/vendors/user-submissions",
							"host": ["{{baseUrl}}"],
							"path": ["vendors", "user-submissions"]
						}
					}
				},
				{
					"name": "Get My Submissions",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/vendors/my-submissions",
							"host": ["{{baseUrl}}"],
							"path": ["vendors", "my-submissions"]
						}
					}
				},
				{
					"name": "Get Categories",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/vendors/categories/list",
							"host": ["{{baseUrl}}"],
							"path": ["vendors", "categories", "list"]
						}
					}
				},
				{
					"name": "Increment Click Count",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/vendors/:id/click",
							"host": ["{{baseUrl}}"],
							"path": ["vendors", ":id", "click"],
							"variable": [
								{
									"key": "id",
									"value": "VENDOR_ID"
								}
							]
						}
					}
				}
			]
		},
		{
			"name": "Admin",
			"item": [
				{
					"name": "Get All Submissions",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/admin/submissions?status=pending",
							"host": ["{{baseUrl}}"],
							"path": ["admin", "submissions"],
							"query": [
								{
									"key": "status",
									"value": "pending"
								}
							]
						}
					}
				},
				{
					"name": "Approve Submission",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/admin/submissions/:id/approve",
							"host": ["{{baseUrl}}"],
							"path": ["admin", "submissions", ":id", "approve"],
							"variable": [
								{
									"key": "id",
									"value": "VENDOR_ID"
								}
							]
						}
					}
				},
				{
					"name": "Reject Submission",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"reason\": \"Duplicate vendor\"\n}"
						},
						"url": {
							"raw": "{{baseUrl}}/admin/submissions/:id/reject",
							"host": ["{{baseUrl}}"],
							"path": ["admin", "submissions", ":id", "reject"],
							"variable": [
								{
									"key": "id",
									"value": "VENDOR_ID"
								}
							]
						}
					}
				},
				{
					"name": "Edit and Approve",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Updated Name\",\n    \"category\": \"Grocery\",\n    \"description\": \"Updated description\"\n}"
						},
						"url": {
							"raw": "{{baseUrl}}/admin/submissions/:id",
							"host": ["{{baseUrl}}"],
							"path": ["admin", "submissions", ":id"],
							"variable": [
								{
									"key": "id",
									"value": "VENDOR_ID"
								}
							]
						}
					}
				},
				{
					"name": "Create Vendor (Admin)",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Admin Vendor\",\n    \"category\": \"Food\",\n    \"description\": \"Created by admin\",\n    \"location\": {\n        \"lat\": 28.6139,\n        \"lng\": 77.2090\n    }\n}"
						},
						"url": {
							"raw": "{{baseUrl}}/admin/vendors",
							"host": ["{{baseUrl}}"],
							"path": ["admin", "vendors"]
						}
					}
				},
				{
					"name": "Get Analytics",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/admin/analytics",
							"host": ["{{baseUrl}}"],
							"path": ["admin", "analytics"]
						}
					}
				}
			]
		},
		{
			"name": "Test/Mock",
			"item": [
				{
					"name": "Test Health",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/test/health",
							"host": ["{{baseUrl}}"],
							"path": ["test", "health"]
						}
					}
				},
				{
					"name": "Mock Vendors",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/test/mock-vendors",
							"host": ["{{baseUrl}}"],
							"path": ["test", "mock-vendors"]
						}
					}
				},
				{
					"name": "Mock Nearby",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/test/mock-nearby?lat=28.6139&lng=77.2090",
							"host": ["{{baseUrl}}"],
							"path": ["test", "mock-nearby"],
							"query": [
								{
									"key": "lat",
									"value": "28.6139"
								},
								{
									"key": "lng",
									"value": "77.2090"
								}
							]
						}
					}
				},
				{
					"name": "Mock Login",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/test/mock-login",
							"host": ["{{baseUrl}}"],
							"path": ["test", "mock-login"]
						}
					}
				},
				{
					"name": "Mock Categories",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/test/mock-categories",
							"host": ["{{baseUrl}}"],
							"path": ["test", "mock-categories"]
						}
					}
				},
				{
					"name": "Mock Analytics",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/test/mock-analytics",
							"host": ["{{baseUrl}}"],
							"path": ["test", "mock-analytics"]
						}
					}
				},
				{
					"name": "Test Delay",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/test/delay?ms=2000",
							"host": ["{{baseUrl}}"],
							"path": ["test", "delay"],
							"query": [
								{
									"key": "ms",
									"value": "2000"
								}
							]
						}
					}
				}
			]
		}
	]
}
```

---

## Quick Start Guide

1. **Import into Postman:**
   - Copy the JSON above
   - In Postman: File → Import → Raw Text → Paste JSON

2. **Set Environment Variables:**
   - Create a new environment
   - Add variable `baseUrl` = `http://localhost:5005/api`
   - Add variable `token` = (will be set automatically after login)

3. **Test Flow:**
   - Run "Health Check" to verify server is running
   - Run "Register" or "Login" to get a token
   - Token will be automatically saved (if using the Login request with test script)
   - Use other endpoints with the saved token

4. **For Admin Routes:**
   - You need to login with an admin account
   - Use the admin token for admin endpoints

---

## Notes

- Replace `VENDOR_ID` with actual vendor IDs from your database
- All admin routes require authentication with an admin role
- The Login request includes a test script that automatically saves the token
- Base URL can be changed in environment variables for different environments (dev, staging, prod)

