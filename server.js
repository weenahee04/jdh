
/**
 * DHAMMA NFT GACHA - BACKEND SERVER
 * 
 * Prerequisites: Node.js v18+
 * Installation: npm install express cors dotenv form-data
 * Run: node server.js
 */

const express = require('express');
const cors = require('cors');
// const fetch = require('node-fetch'); // Uncomment if using Node < 18

const app = express();
const PORT = 3001; // Backend runs on port 3001

// Middleware
app.use(cors()); // Allow frontend to access
app.use(express.json({ limit: '10mb' })); // Allow large base64 images
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURATION ---
const EASYSLIP_API_KEY = '49db3aee-e260-4eee-9c1d-81b590b267bf';
const EASYSLIP_URL = 'https://developer.easyslip.com/api/v1/verify';

// --- LINE LOGIN CONFIG ---
// ⚠️ REPLACE WITH YOUR OWN CHANNEL ID & SECRET FROM developers.line.biz
const LINE_CHANNEL_ID = 'YOUR_LINE_CHANNEL_ID'; 
const LINE_CHANNEL_SECRET = 'YOUR_LINE_CHANNEL_SECRET';
const LINE_REDIRECT_URI = 'http://localhost:5173'; // Frontend URL

// Mock Database (In-memory storage for demonstration)
const db = {
    users: [],
    topups: [], // Stores transaction history
    logs: []    // Stores raw API responses
};

// --- ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dhamma Backend is running' });
});

// LINE Login Callback Handler
app.post('/api/auth/line', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: 'Authorization code missing' });
        }

        console.log('[LINE Login] exchanging code...');

        // 1. Exchange Code for Access Token
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'authorization_code');
        tokenParams.append('code', code);
        tokenParams.append('redirect_uri', LINE_REDIRECT_URI);
        tokenParams.append('client_id', LINE_CHANNEL_ID);
        tokenParams.append('client_secret', LINE_CHANNEL_SECRET);

        const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            console.error('LINE Token Error:', tokenData);
            return res.status(400).json({ success: false, message: 'Failed to get access token from LINE' });
        }

        // 2. Get User Profile
        const profileResponse = await fetch('https://api.line.me/v2/profile', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
        });

        const profileData = await profileResponse.json();

        if (!profileData.userId) {
            return res.status(400).json({ success: false, message: 'Failed to get user profile' });
        }

        console.log(`[LINE Login] Success: ${profileData.displayName} (${profileData.userId})`);

        // 3. (Optional) Save/Update User in Mock DB
        let user = db.users.find(u => u.lineUserId === profileData.userId);
        if (!user) {
            user = {
                id: `user_${Date.now()}`,
                lineUserId: profileData.userId,
                displayName: profileData.displayName,
                pictureUrl: profileData.pictureUrl,
                joinedAt: new Date()
            };
            db.users.push(user);
        }

        return res.json({
            success: true,
            user: {
                userId: profileData.userId,
                displayName: profileData.displayName,
                pictureUrl: profileData.pictureUrl,
                statusMessage: profileData.statusMessage
            }
        });

    } catch (error) {
        console.error('[LINE Login Error]', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Verify Slip Endpoint
app.post('/api/verify-slip', async (req, res) => {
    try {
        const { image, amount, packageId } = req.body;

        if (!image) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        console.log(`[Verify] Processing slip for package price: ${amount}`);

        // 1. Call EasySlip API
        const response = await fetch(EASYSLIP_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${EASYSLIP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: image })
        });

        const result = await response.json();

        // 2. Log raw response (Mock DB)
        db.logs.push({
            timestamp: new Date(),
            endpoint: 'verify-slip',
            response: result
        });

        // 3. Check API Result
        if (response.status === 200 && result.data && result.data.success === true) {
            const slipAmount = result.data.amount;
            const transRef = result.data.transRef; // Unique Bank Transaction ID

            // Check for duplicate usage (Simple Check)
            const isDuplicate = db.topups.find(t => t.transRef === transRef);
            if (isDuplicate) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'สลิปนี้ถูกใช้งานไปแล้ว (Duplicate Slip)' 
                });
            }

            // Check Amount
            if (slipAmount >= amount) {
                // Success: Record Transaction
                const newTransaction = {
                    id: `tx_${Date.now()}`,
                    transRef,
                    amount: slipAmount,
                    packageAmount: amount,
                    packageId,
                    status: 'COMPLETED',
                    verifiedAt: new Date()
                };
                db.topups.push(newTransaction);

                console.log(`[Success] Slip verified. Amount: ${slipAmount}`);
                
                return res.json({
                    success: true,
                    data: {
                        amount: slipAmount,
                        sender: result.data.sender,
                        receiver: result.data.receiver,
                        date: result.data.date
                    }
                });
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: `ยอดเงินไม่ครบ (โอน ${slipAmount}, ต้องการ ${amount})` 
                });
            }
        } else {
            return res.status(400).json({ 
                success: false, 
                message: result.message || 'สลิปไม่ถูกต้อง หรือไม่พบข้อมูล' 
            });
        }

    } catch (error) {
        console.error('[Error]', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`   - Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   - Verify Slip:  http://localhost:${PORT}/api/verify-slip (POST)`);
    console.log(`   - LINE Login:   http://localhost:${PORT}/api/auth/line (POST)`);
});
