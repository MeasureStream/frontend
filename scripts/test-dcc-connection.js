const API_URL = process.env.VITE_API_URL || 'http://localhost:8080';

async function testAllServices() {
    console.log("==================================================");
    console.log(`🚀 STARTING COMPREHENSIVE API TEST ON: ${API_URL}`);
    console.log("==================================================");

    let xsrfToken = '';
    let testDccId = null;
    let testMuId = '';

    // 1. Test /me and get XSRF token
    try {
        console.log("\n[1] Testing /me and retrieving XSRF token...");
        const response = await fetch(`${API_URL}/me`);
        if (response.ok) {
            const data = await response.json();
            xsrfToken = data.xsrfToken;
            console.log("✅ SUCCESS: Connected to /me");
            console.log(`   User: ${data.name}, XSRF Token: ${xsrfToken.substring(0, 8)}...`);
        } else {
            console.error(`❌ FAILURE: /me returned ${response.status}`);
        }
    } catch (error) {
        console.error("❌ FAILURE: Could not connect to /me", error.message);
    }

    // 2. DCC Service Tests
    console.log("\n[2] Testing DCC Service...");

    // 2.1 List DCCs (Templates)
    try {
        const response = await fetch(`${API_URL}/api/dcc?template=true`);
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ SUCCESS: List DCC templates (found ${data.length})`);
        } else {
            console.error(`❌ FAILURE: GET /api/dcc?template=true returned ${response.status}`);
        }
    } catch (error) {
        console.error("❌ FAILURE: DCC List error", error.message);
    }

    // 2.2 Create DCC Template
    try {
        const response = await fetch(`${API_URL}/api/dcc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': xsrfToken
            },
            body: JSON.stringify({ name: "Test Template " + Date.now() })
        });
        if (response.ok) {
            const data = await response.json();
            testDccId = data.id;
            console.log(`✅ SUCCESS: Created DCC template (ID: ${testDccId})`);
        } else {
            console.error(`❌ FAILURE: POST /api/dcc returned ${response.status}`);
        }
    } catch (error) {
        console.error("❌ FAILURE: DCC Creation error", error.message);
    }

    // 2.3 Update DCC
    if (testDccId !== null) {
        try {
            const response = await fetch(`${API_URL}/api/dcc/${testDccId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken
                },
                body: JSON.stringify({ name: "Updated Test Template" })
            });
            if (response.ok) {
                console.log(`✅ SUCCESS: Updated DCC ${testDccId}`);
            } else {
                console.error(`❌ FAILURE: PUT /api/dcc/${testDccId} returned ${response.status}`);
            }
        } catch (error) {
            console.error("❌ FAILURE: DCC Update error", error.message);
        }

        // 2.4 Validate DCC (Mocked)
        try {
            // We use a mock FormData since we're in a script
            const formData = new URLSearchParams(); // Fetch can handle URLSearchParams as body
            formData.append('fileType', 'PDF');
            // In a real environment we'd use actual FormData and a Blob
            
            // For the script, we'll try a simplified POST if the server allows or mock the behavior
            // Since DccController expects @RequestParam("file"), we might need actual FormData.
            // Node.js 'fetch' (from v18+) supports FormData.
            
            const fd = new FormData();
            const blob = new Blob(['mock content'], { type: 'application/pdf' });
            fd.append('file', blob, 'test.pdf');
            fd.append('fileType', 'PDF');

            const response = await fetch(`${API_URL}/api/dcc/${testDccId}/validate`, {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken
                },
                body: fd
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ SUCCESS: Validated DCC ${testDccId} (pdfValid: ${data.pdfValid})`);
            } else {
                console.error(`❌ FAILURE: POST /api/dcc/${testDccId}/validate returned ${response.status}`);
            }
        } catch (error) {
            console.warn("⚠️ WARNING: DCC Validation test skipped or failed (Node environment limitation)", error.message);
        }

        // 2.5 Publish DCC
        try {
            const response = await fetch(`${API_URL}/api/dcc/${testDccId}/publish`, {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ SUCCESS: Published DCC ${testDccId} (Status: ${data.status})`);
            } else {
                console.error(`❌ FAILURE: POST /api/dcc/${testDccId}/publish returned ${response.status}`);
            }
        } catch (error) {
            console.error("❌ FAILURE: DCC Publish error", error.message);
        }

        // 2.6 Download DCC
        try {
            const response = await fetch(`${API_URL}/api/dcc/${testDccId}/download?fileType=PDF`);
            if (response.ok) {
                console.log(`✅ SUCCESS: Downloaded DCC ${testDccId}`);
            } else {
                console.error(`❌ FAILURE: GET /api/dcc/${testDccId}/download returned ${response.status}`);
            }
        } catch (error) {
            console.error("❌ FAILURE: DCC Download error", error.message);
        }

        // 2.7 Delete DCC
        try {
            const response = await fetch(`${API_URL}/api/dcc/${testDccId}`, {
                method: 'DELETE',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken
                }
            });
            if (response.ok) {
                console.log(`✅ SUCCESS: Deleted DCC ${testDccId}`);
            } else {
                console.error(`❌ FAILURE: DELETE /api/dcc/${testDccId} returned ${response.status}`);
            }
        } catch (error) {
            console.error("❌ FAILURE: DCC Delete error", error.message);
        }
    }

    // 3. Other Services Connectivity Tests
    console.log("\n[3] Testing Connectivity of other services...");

    const otherEndpoints = [
        { name: "Nodes", url: `${API_URL}/API/nodes` },
        { name: "Measurement Units", url: `${API_URL}/API/measurementunits` },
        { name: "Control Units", url: `${API_URL}/API/controlunits` },
        { name: "Measures", url: `${API_URL}/API/measures` },
        { name: "Users", url: `${API_URL}/API/user` }
    ];

    for (const endpoint of otherEndpoints) {
        try {
            const response = await fetch(endpoint.url);
            if (response.ok) {
                console.log(`✅ SUCCESS: ${endpoint.name} endpoint is reachable`);
            } else {
                console.warn(`⚠️ WARNING: ${endpoint.name} endpoint returned ${response.status}`);
            }
        } catch (error) {
            console.error(`❌ FAILURE: ${endpoint.name} endpoint is NOT reachable`, error.message);
        }
    }

    console.log("\n==================================================");
    console.log("🏁 API TEST COMPLETE");
    console.log("==================================================");
}

testAllServices();
