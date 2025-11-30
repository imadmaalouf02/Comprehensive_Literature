module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/Comprehensive_Literature/app/api/literature-review/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Comprehensive_Literature$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Comprehensive_Literature/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { query, apiKey, model } = body;
        if (!query || typeof query !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Comprehensive_Literature$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid query parameter"
            }, {
                status: 400
            });
        }
        const trimmedApiKey = apiKey?.trim();
        const finalApiKey = trimmedApiKey || process.env.OPENROUTER_API_KEY;
        const finalModel = model?.trim() || "openai/gpt-4o-mini";
        if (!finalApiKey) {
            console.error("[v0] Missing OPENROUTER_API_KEY - no custom key provided and no env variable set");
            return __TURBOPACK__imported__module__$5b$project$5d2f$Comprehensive_Literature$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "API key not configured. Please add your API key in Settings."
            }, {
                status: 500
            });
        }
        if (!finalApiKey.startsWith("sk-")) {
            console.error("[v0] Invalid API key format - should start with sk-");
            return __TURBOPACK__imported__module__$5b$project$5d2f$Comprehensive_Literature$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid API key format. API keys should start with 'sk-'"
            }, {
                status: 400
            });
        }
        console.log("[v0] Calling Python backend - Query:", query, "Model:", finalModel, "Using custom key:", !!trimmedApiKey);
        // Call Python backend service
        const response = await callPythonBackend(query, finalApiKey, finalModel);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Comprehensive_Literature$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (error) {
        console.error("[v0] API route error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate literature review";
        return __TURBOPACK__imported__module__$5b$project$5d2f$Comprehensive_Literature$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: errorMessage
        }, {
            status: 500
        });
    }
}
async function callPythonBackend(query, apiKey, model) {
    return new Promise((resolve, reject)=>{
        const pythonScriptPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "scripts", "literature_review_service.py");
        let pythonPath = process.env.PYTHON_PATH || "python";
        // Try common Python installation paths on Windows if python3 is not available
        if (process.platform === "win32") {
            if (!pythonPath || pythonPath === "python") {
                pythonPath = "C:\\Users\\user\\anaconda3\\envs\\myenv\\python.exe";
            }
        }
        console.log("[v0] Spawning Python process with environment variables");
        console.log("[v0] Python path:", pythonPath);
        const pythonProcess = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])(pythonPath, [
            pythonScriptPath
        ], {
            env: {
                ...process.env,
                OPENROUTER_API_KEY: apiKey,
                QUERY: query,
                MODEL: model
            }
        });
        let stdout = "";
        let stderr = "";
        pythonProcess.stdout?.on("data", (data)=>{
            stdout += data.toString();
            console.log("[v0] Python stdout:", data.toString());
        });
        pythonProcess.stderr?.on("data", (data)=>{
            stderr += data.toString();
            console.error("[v0] Python stderr:", data.toString());
        });
        pythonProcess.on("close", (code)=>{
            if (code !== 0) {
                console.error("[v0] Python process failed with code:", code, "stderr:", stderr);
                reject(new Error(`Python process failed: ${stderr || "Unknown error"}`));
                return;
            }
            try {
                // Extract JSON from stdout
                const jsonMatch = stdout.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error("[v0] No JSON output found in stdout:", stdout);
                    reject(new Error("No JSON output from Python service"));
                    return;
                }
                const result = JSON.parse(jsonMatch[0]);
                console.log("[v0] Successfully parsed Python response");
                resolve(result);
            } catch (error) {
                console.error("[v0] Failed to parse Python output:", error, "stdout:", stdout);
                reject(new Error(`Failed to parse Python output: ${error}`));
            }
        });
        pythonProcess.on("error", (error)=>{
            console.error("[v0] Failed to spawn Python process:", error);
            reject(new Error(`Failed to spawn Python process: ${error.message}`));
        });
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6f13a13d._.js.map