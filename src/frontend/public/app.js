/**
 * Future Farms Framework — frontend app.
 *
 * Offline-first PWA:
 *   - All 200 questions are cached on first load (IndexedDB + Service Worker).
 *   - Answers are saved to IndexedDB first.
 *   - When online, we attempt to flush to the backend; on failure, we keep
 *     the local copy and retry.
 */

(() => {
    "use strict";

    // ─── Constants ───────────────────────────────────────────────────
    const DB_NAME = "fff-offline";
    const DB_VERSION = 1;
    const STORE_QUESTIONS = "questions";
    const STORE_ANSWERS = "answers";
    const STORE_META = "meta";

    // ─── DOM helpers ─────────────────────────────────────────────────
    const $ = (id) => document.getElementById(id);
    const screens = {
        start: $("screen-start"),
        question: $("screen-question"),
        result: $("screen-result"),
        simulator: $("screen-simulator"),
        loading: $("screen-loading"),
    };
    const showScreen = (name) => {
        Object.values(screens).forEach((s) => {
            s.hidden = true;
            s.classList.remove("screen-active");
        });
        screens[name].hidden = false;
        screens[name].classList.add("screen-active");
    };

    // ─── State ───────────────────────────────────────────────────────
    const state = {
        questions: [],
        pillars: [],
        assessmentId: null,
        currentIndex: 0,
        answers: {}, // { questionId: 'yes' | 'no' }
        result: null,
    };

    // ─── IndexedDB ───────────────────────────────────────────────────
    function openDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_QUESTIONS)) {
                    db.createObjectStore(STORE_QUESTIONS, { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains(STORE_ANSWERS)) {
                    db.createObjectStore(STORE_ANSWERS, { keyPath: "questionId" });
                }
                if (!db.objectStoreNames.contains(STORE_META)) {
                    db.createObjectStore(STORE_META, { keyPath: "key" });
                }
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async function dbPutAll(store, items) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, "readwrite");
            items.forEach((item) => tx.objectStore(store).put(item));
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e.target.error);
        });
    }

    async function dbGetAll(store) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, "readonly");
            const req = tx.objectStore(store).getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async function dbPut(store, item) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, "readwrite");
            tx.objectStore(store).put(item);
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e.target.error);
        });
    }

    async function dbGet(store, key) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, "readonly");
            const req = tx.objectStore(store).get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    // ─── API ─────────────────────────────────────────────────────────
    async function apiFetch(path, options = {}) {
        const res = await fetch(path, {
            headers: { "Content-Type": "application/json", ...(options.headers || {}) },
            ...options,
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API ${res.status} ${path}: ${text}`);
        }
        return res.json();
    }

    async function loadQuestionsFromAPI() {
        return apiFetch("/api/questions");
    }

    async function loadPillarsFromAPI() {
        return apiFetch("/api/pillars");
    }

    // ─── Cache refresh ──────────────────────────────────────────────
    async function refreshQuestionCache() {
        try {
            const [questions, pillars] = await Promise.all([
                loadQuestionsFromAPI(),
                loadPillarsFromAPI(),
            ]);
            await dbPutAll(STORE_QUESTIONS, questions);
            await dbPut(STORE_META, { key: "pillars", value: pillars, ts: Date.now() });
            await dbPut(STORE_META, { key: "questionscached", value: true, ts: Date.now() });
            return { questions, pillars };
        } catch (e) {
            console.warn("Could not refresh from API, using offline cache:", e);
            const [questions, metaPillars] = await Promise.all([
                dbGetAll(STORE_QUESTIONS),
                dbGet(STORE_META, "pillars"),
            ]);
            return { questions, pillars: metaPillars?.value || [] };
        }
    }

    async function loadCached() {
        const [questions, pillarsMeta] = await Promise.all([
            dbGetAll(STORE_QUESTIONS),
            dbGet(STORE_META, "pillars"),
        ]);
        return { questions, pillars: pillarsMeta?.value || [] };
    }

    // ─── Start assessment ───────────────────────────────────────────
    async function startAssessment() {
        showScreen("loading");
        const farm = {
            name: $("farm-name").value || null,
            region: $("farm-region").value || null,
            crop_type: $("farm-crop").value || null,
        };
        try {
            const data = await apiFetch("/api/assessments/start", {
                method: "POST",
                body: JSON.stringify(farm),
            });
            state.assessmentId = data.assessment_id;
            state.answers = {};
            state.currentIndex = 0;
            showQuestion();
        } catch (e) {
            console.error("Failed to start assessment:", e);
            // Offline fallback: generate a local UUID and continue
            state.assessmentId = crypto.randomUUID
                ? crypto.randomUUID()
                : "offline-" + Date.now();
            state.answers = {};
            state.currentIndex = 0;
            showQuestion();
        }
    }

    // ─── Question screen ────────────────────────────────────────────
    function showQuestion() {
        const q = state.questions[state.currentIndex];
        if (!q) {
            return submitAssessment();
        }
        const pillar = state.pillars.find((p) => p.id === q.pillar_id);
        const cap = state.questions
            .map((x) => x.capability_id)
            .filter((v, i, a) => a.indexOf(v) === i)
            .includes(q.capability_id)
            ? q.capability_id
            : "";

        $("question-meta").textContent =
            `${pillar ? pillar.name : "Pillar " + q.pillar_id} · ${q.capability_id}`;
        $("question-text").textContent = q.question_text;
        $("question-why").textContent = q.why_it_matters || "";

        const total = state.questions.length;
        const pct = ((state.currentIndex + 1) / total) * 100;
        $("progress-fill").style.width = pct + "%";
        $("progress-text").textContent = `Question ${state.currentIndex + 1} of ${total}`;

        $("btn-prev").disabled = state.currentIndex === 0;
        $("btn-yes").disabled = state.answers[q.id] === "yes";
        $("btn-no").disabled = state.answers[q.id] === "no";

        showScreen("question");
    }

    async function answer(value) {
        const q = state.questions[state.currentIndex];
        if (!q) return;
        state.answers[q.id] = value;
        // Persist locally
        try {
            await dbPut(STORE_ANSWERS, { questionId: q.id, value });
        } catch (e) {
            console.warn("Local answer persist failed:", e);
        }
        // Try to save to backend if online
        trySaveAnswers().catch(() => {});

        if (state.currentIndex < state.questions.length - 1) {
            state.currentIndex++;
            showQuestion();
        } else {
            submitAssessment();
        }
    }

    async function trySaveAnswers() {
        const payload = Object.entries(state.answers).map(([question_id, value]) => ({
            question_id,
            value,
        }));
        if (!payload.length) return;
        await apiFetch(`/api/assessments/${state.assessmentId}/answers`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    function previousQuestion() {
        if (state.currentIndex > 0) {
            state.currentIndex--;
            showQuestion();
        }
    }

    function skipQuestion() {
        if (state.currentIndex < state.questions.length - 1) {
            state.currentIndex++;
            showQuestion();
        } else {
            submitAssessment();
        }
    }

    // ─── Submit & render report ─────────────────────────────────────
    async function submitAssessment() {
        showScreen("loading");
        // Flush remaining answers
        try {
            await trySaveAnswers();
        } catch (e) {
            console.warn("Final answer flush failed (continuing offline):", e);
        }

        try {
            const result = await apiFetch(
                `/api/assessments/${state.assessmentId}/submit`,
                { method: "POST" }
            );
            state.result = result;
            renderResult(result);
        } catch (e) {
            console.warn("Submit API failed or offline — computing local results:", e);
            const localResult = computeLocalResult();
            state.result = localResult;
            renderResult(localResult);
        }
    }

    function computeLocalResult() {
        const answers = state.answers || {};
        const questions = state.questions || [];

        const capQuestions = {};
        const capPillars = {};
        questions.forEach((q) => {
            if (!capQuestions[q.capability_id]) {
                capQuestions[q.capability_id] = [];
            }
            capQuestions[q.capability_id].push(q);
            capPillars[q.capability_id] = q.pillar_id;
        });

        const statusLevels = {
            0: "non_existent",
            1: "emerging",
            2: "basic",
            3: "developing",
            4: "established",
            5: "advanced",
        };
        const levelValues = {
            non_existent: 0,
            emerging: 1,
            basic: 2,
            developing: 3,
            established: 4,
            advanced: 5,
        };

        const capability_status = {};
        const pillarCapValues = {};

        Object.entries(capQuestions).forEach(([capId, qList]) => {
            const yesCount = qList.reduce((acc, q) => acc + (answers[q.id] === "yes" ? 1 : 0), 0);
            const status = statusLevels[yesCount] || "non_existent";
            capability_status[capId] = status;

            const pid = capPillars[capId];
            if (!pillarCapValues[pid]) pillarCapValues[pid] = [];
            pillarCapValues[pid].push(levelValues[status]);
        });

        let rawFFMI = 0;
        let totalCapCount = 0;
        const pillar_scores = {};

        Object.entries(pillarCapValues).forEach(([pid, vals]) => {
            const sum = vals.reduce((a, b) => a + b, 0);
            pillar_scores[pid] = vals.length ? sum / (5.0 * vals.length) : 0;
            rawFFMI += sum;
            totalCapCount += vals.length;
        });

        const ffmi_score = totalCapCount ? Math.round((rawFFMI * 24.0 / (5.0 * totalCapCount)) * 100) / 100 : 0;

        let tier = 1;
        let tier_classification = "Informal Farm";
        if (ffmi_score >= 21) { tier = 5; tier_classification = "Future Ready Farm"; }
        else if (ffmi_score >= 16) { tier = 4; tier_classification = "Investment Ready Farm"; }
        else if (ffmi_score >= 10) { tier = 3; tier_classification = "Structured Farm"; }
        else if (ffmi_score >= 5) { tier = 2; tier_classification = "Emerging Agribusiness"; }

        const sortedPillars = Object.entries(pillar_scores).sort((a, b) => b[1] - a[1]);
        const strongest_pillar_id = sortedPillars.length ? parseInt(sortedPillars[0][0], 10) : null;
        const priority_gap_pillar_id = sortedPillars.length ? parseInt(sortedPillars[sortedPillars.length - 1][0], 10) : null;

        const recs = [];
        questions.forEach((q) => {
            if (answers[q.id] === "no" || !answers[q.id]) {
                const learning = Array.isArray(q.support_available) ? q.support_available.join(", ") : (q.support_available || "FAAB Module");
                recs.push({
                    question_id: q.id,
                    pillar_id: q.pillar_id,
                    capability_id: q.capability_id,
                    gap: q.question_text,
                    capability_status: capability_status[q.capability_id] || "non_existent",
                    recommended_action: q.if_no_recommendation || "Review this capability.",
                    recommended_learning: learning,
                    potential_service: q.service_ref || "Farm business advisory",
                    priority: q.priority || "quick_win",
                });
            }
        });

        const prioOrder = { quick_win: 0, medium_term: 1, strategic: 2 };
        recs.sort((a, b) => (prioOrder[a.priority] ?? 99) - (prioOrder[b.priority] ?? 99));

        return {
            ffmi_score,
            tier,
            tier_classification,
            pillar_scores,
            capability_status,
            strongest_pillar_id,
            priority_gap_pillar_id,
            recommendations: recs,
        };
    }

    function renderResult(data) {
        showScreen("result");
        const classification = data.tier_classification || "Informal Farm";
        const score = typeof data.ffmi_score === "number" ? data.ffmi_score.toFixed(2) : "0.00";
        $("result-tier").textContent = classification;
        $("result-ffmi").textContent = score;

        const strongestId = data.strongest_pillar_id !== null && data.strongest_pillar_id !== undefined ? parseInt(data.strongest_pillar_id, 10) : null;
        const priorityGapId = data.priority_gap_pillar_id !== null && data.priority_gap_pillar_id !== undefined ? parseInt(data.priority_gap_pillar_id, 10) : null;

        const strongestPillar = state.pillars.find((p) => p.id === strongestId);
        const priorityGap = state.pillars.find((p) => p.id === priorityGapId);

        $("result-strongest").textContent = strongestPillar ? strongestPillar.name : "—";
        $("result-priority-gap").textContent = priorityGap ? priorityGap.name : "—";

        const ul = $("result-pillars");
        ul.innerHTML = "";
        const scores = data.pillar_scores || {};
        Object.entries(scores).forEach(([pid, pScore]) => {
            const pillar = state.pillars.find((p) => p.id === parseInt(pid, 10));
            const li = document.createElement("li");
            const scorePct = typeof pScore === "number" ? (pScore * 100).toFixed(0) : "0";
            li.textContent = `${pillar ? pillar.name : "Pillar " + pid}: ${scorePct}%`;
            ul.appendChild(li);
        });

        // Risk badge calculation
        const lowestScore = priorityGapId ? (scores[priorityGapId] || 0) : 0;
        const ffmiNum = typeof data.ffmi_score === "number" ? data.ffmi_score : 0;
        renderRiskBadge("result-risk-badge", ffmiNum, lowestScore);

        // Visual Dashboard Charts: Radar & Pillar Progress Bars
        renderRadarChart("result-radar-chart", scores);
        renderPillarBars("result-pillar-bars", scores);
        renderPeerBenchmark($("farm-region")?.value || "Western Kenya", ffmiNum);

        const recs = $("result-recommendations");
        recs.innerHTML = "";
        const recList = data.recommendations || [];
        recList.slice(0, 15).forEach((r) => {
            const li = document.createElement("li");
            const prio = r.priority || "quick_win";
            li.className = "priority-" + prio;
            const prioText = prio.replace("_", " ");
            li.innerHTML = `
                <span class="priority-pill priority-${prio}">${prioText}</span>
                <p><strong>${r.gap || "Recommendation"}</strong></p>
                <p>${r.recommended_action || ""}</p>
                <p class="muted small">Learning: ${r.recommended_learning || "FAAB Module"}</p>
                <p class="muted small">Service: ${r.potential_service || "Farm Advisory"}</p>
            `;
            recs.appendChild(li);
        });

        // Initialize Post-Assessment What-If Planner
        initPostAssessmentWhatIfPlanner(data);
    }

    function renderRiskBadge(badgeId, ffmi, lowestScore) {
        const badge = $(badgeId);
        if (!badge) return;
        badge.className = "risk-badge";
        if (ffmi < 5.0 || lowestScore < 0.25) {
            badge.textContent = "🔴 High Risk (Urgent gap intervention required)";
            badge.classList.add("risk-high");
        } else if (ffmi < 16.0 || lowestScore < 0.50) {
            badge.textContent = "🟡 Medium Risk (Developing capabilities; vulnerability to shocks)";
            badge.classList.add("risk-medium");
        } else {
            badge.textContent = "🟢 Low Risk (High resilience across core pillars)";
            badge.classList.add("risk-low");
        }
    }

    // ─── Visual Charts (Radar & Progress Bars) ────────────────────────
    function renderRadarChart(containerId, scoresMap) {
        const container = $(containerId);
        if (!container) return;

        const pillars = state.pillars.length ? state.pillars : DEFAULT_PILLARS;
        const total = pillars.length || 8;
        const cx = 175;
        const cy = 175;
        const R = 110;

        let gridPolygons = "";
        [0.2, 0.4, 0.6, 0.8, 1.0].forEach((level) => {
            const pts = [];
            for (let i = 0; i < total; i++) {
                const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                const x = cx + R * level * Math.cos(angle);
                const y = cy + R * level * Math.sin(angle);
                pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            }
            gridPolygons += `<polygon points="${pts.join(" ")}" fill="none" stroke="#e5e7eb" stroke-width="1"/>`;
        });

        let axisLines = "";
        let axisLabels = "";
        const dataPoints = [];

        pillars.forEach((p, i) => {
            const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
            const ax = cx + R * Math.cos(angle);
            const ay = cy + R * Math.sin(angle);
            axisLines += `<line x1="${cx}" y1="${cy}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="#e5e7eb" stroke-width="1"/>`;

            const lx = cx + (R + 26) * Math.cos(angle);
            const ly = cy + (R + 26) * Math.sin(angle);
            const shortName = p.name ? p.name.split(" ")[0] : `P${p.id}`;
            axisLabels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#4b5563" font-weight="600">${shortName}</text>`;

            const rawVal = scoresMap[p.id] !== undefined ? scoresMap[p.id] : (scoresMap[String(p.id)] || 0.4);
            const val = Math.max(0.05, Math.min(1.0, parseFloat(rawVal)));
            const dx = cx + R * val * Math.cos(angle);
            const dy = cy + R * val * Math.sin(angle);
            dataPoints.push({ x: dx, y: dy, pct: Math.round(val * 100) });
        });

        const polygonPts = dataPoints.map((d) => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(" ");
        const dots = dataPoints
            .map((d) => `<circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="4" fill="#1f6f43" stroke="#fff" stroke-width="1.5"/>`)
            .join("");

        container.innerHTML = `
            <svg viewBox="0 0 350 350" class="radar-svg">
                ${gridPolygons}
                ${axisLines}
                <polygon points="${polygonPts}" fill="rgba(31, 111, 67, 0.28)" stroke="#1f6f43" stroke-width="2.5"/>
                ${dots}
                ${axisLabels}
            </svg>
        `;
    }

    function renderPillarBars(containerId, scoresMap) {
        const container = $(containerId);
        if (!container) return;
        container.innerHTML = "";

        const pillars = state.pillars.length ? state.pillars : DEFAULT_PILLARS;
        pillars.forEach((p) => {
            const rawVal = scoresMap[p.id] !== undefined ? scoresMap[p.id] : (scoresMap[String(p.id)] || 0.4);
            const pct = Math.round(parseFloat(rawVal) * 100);
            const colorClass = pct >= 70 ? "bar-high" : (pct >= 40 ? "bar-med" : "bar-low");
            const statusLabel = pct >= 80 ? "Advanced" : (pct >= 60 ? "Established" : (pct >= 40 ? "Developing" : (pct >= 20 ? "Emerging" : "Non-Existent")));

            const item = document.createElement("div");
            item.className = "pillar-bar-item";
            item.innerHTML = `
                <div class="pillar-bar-header">
                    <span>${p.name}</span>
                    <span><strong>${pct}%</strong> <small class="muted">(${statusLabel})</small></span>
                </div>
                <div class="pillar-bar-track">
                    <div class="pillar-bar-fill ${colorClass}" style="width: ${pct}%;"></div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    function renderPeerBenchmark(region, ffmi) {
        const regName = $("benchmark-region-name");
        if (regName) regName.textContent = region || "Western Kenya";

        const yourScoreEl = $("bench-your-score");
        if (yourScoreEl) yourScoreEl.textContent = typeof ffmi === "number" ? ffmi.toFixed(2) : "0.00";

        const regionalAverages = {
            "Western Kenya": 9.80,
            "Rift Valley": 11.20,
            "Central Kenya": 12.40,
            "Eastern Kenya": 8.50,
            "Coast": 8.10,
        };
        const avg = regionalAverages[region] || 10.0;
        const avgScoreEl = $("bench-avg-score");
        if (avgScoreEl) avgScoreEl.textContent = avg.toFixed(2);

        const yourPct = Math.min(100, Math.max(0, (ffmi / 24.0) * 100));
        const fillYour = $("bench-fill-your");
        if (fillYour) fillYour.style.width = `${yourPct}%`;
    }

    function downloadPdf() {
        if (!state.assessmentId) {
            alert("Please start or complete an assessment to download your official report.");
            return;
        }
        window.open(`/api/assessments/${state.assessmentId}/pdf`, "_blank");
    }

    // ─── Simulator & What-If Planner Logic ────────────────────────────
    const DEFAULT_PILLARS = [
        { id: 1, name: "Governance & Strategy", defaultVal: 0.4 },
        { id: 2, name: "Soil & Land Health", defaultVal: 0.6 },
        { id: 3, name: "Water Stewardship", defaultVal: 0.3 },
        { id: 4, name: "Crop Management", defaultVal: 0.7 },
        { id: 5, name: "Livestock Management", defaultVal: 0.2 },
        { id: 6, name: "Financial Inclusion", defaultVal: 0.5 },
        { id: 7, name: "Technology & Data", defaultVal: 0.3 },
        { id: 8, name: "Market Access", defaultVal: 0.6 },
    ];

    function initSimulatorSliders() {
        const container = $("sim-sliders-container");
        if (!container || container.children.length > 0) return;

        const pillars = state.pillars.length ? state.pillars : DEFAULT_PILLARS;
        container.innerHTML = "";

        pillars.forEach((p, idx) => {
            const defVal = DEFAULT_PILLARS[idx]?.defaultVal ?? 0.5;
            const item = document.createElement("div");
            item.className = "slider-item";
            item.innerHTML = `
                <div class="slider-header">
                    <span>${p.name}</span>
                    <span id="sim-val-${p.id}" class="slider-val">${Math.round(defVal * 100)}%</span>
                </div>
                <input type="range" min="0" max="100" value="${Math.round(defVal * 100)}" class="slider-input" id="sim-input-${p.id}">
            `;
            container.appendChild(item);

            const input = item.querySelector(`#sim-input-${p.id}`);
            input.addEventListener("input", (e) => {
                $(`sim-val-${p.id}`).textContent = `${e.target.value}%`;
                runSimulation();
            });
        });
    }

    function initPostAssessmentWhatIfPlanner(data) {
        const container = $("post-sim-sliders-container");
        if (!container) return;
        container.innerHTML = "";

        const pillars = state.pillars.length ? state.pillars : DEFAULT_PILLARS;
        const scores = data.pillar_scores || {};

        pillars.forEach((p) => {
            const currentVal = Math.round((scores[p.id] || 0.3) * 100);
            const item = document.createElement("div");
            item.className = "slider-item";
            item.innerHTML = `
                <div class="slider-header">
                    <span>${p.name}</span>
                    <span id="post-sim-val-${p.id}" class="slider-val">${currentVal}%</span>
                </div>
                <input type="range" min="0" max="100" value="${currentVal}" class="slider-input" id="post-sim-input-${p.id}">
            `;
            container.appendChild(item);

            const input = item.querySelector(`#post-sim-input-${p.id}`);
            input.addEventListener("input", (e) => {
                $(`post-sim-val-${p.id}`).textContent = `${e.target.value}%`;
                recalcPostSimulation();
            });
        });

        recalcPostSimulation();
    }

    function recalcPostSimulation() {
        const pillars = state.pillars.length ? state.pillars : DEFAULT_PILLARS;
        let totalFraction = 0;
        let lowestVal = 1.0;

        pillars.forEach((p) => {
            const input = $(`post-sim-input-${p.id}`);
            const val = input ? parseFloat(input.value) / 100.0 : 0.5;
            totalFraction += val;
            if (val < lowestVal) lowestVal = val;
        });

        const avg = totalFraction / pillars.length;
        const ffmi = Math.round((avg * 24.0) * 100) / 100;

        let tier = "Tier 1: Informal Farm";
        if (ffmi >= 21) tier = "Tier 5: Future Ready Farm";
        else if (ffmi >= 16) tier = "Tier 4: Investment Ready Farm";
        else if (ffmi >= 10) tier = "Tier 3: Structured Farm";
        else if (ffmi >= 5) tier = "Tier 2: Emerging Agribusiness";

        $("post-sim-tier").textContent = tier;
        $("post-sim-ffmi").textContent = ffmi.toFixed(2);

        let risk = "🟢 Low Risk";
        if (ffmi < 5.0 || lowestVal < 0.25) risk = "🔴 High Risk";
        else if (ffmi < 16.0 || lowestVal < 0.50) risk = "🟡 Medium Risk";
        $("post-sim-risk").textContent = risk;
    }

    async function runSimulation() {
        const pillars = state.pillars.length ? state.pillars : DEFAULT_PILLARS;
        const scores = {};
        let totalFraction = 0;
        let lowestScore = 1.0;

        pillars.forEach((p) => {
            const input = $(`sim-input-${p.id}`);
            const frac = input ? parseFloat(input.value) / 100.0 : 0.5;
            scores[p.id] = frac;
            totalFraction += frac;
            if (frac < lowestScore) lowestScore = frac;
        });

        const avg = totalFraction / pillars.length;
        const ffmi_score = Math.round((avg * 24.0) * 100) / 100;

        let tier_num = 1;
        let tier_classification = "Informal Farm";
        if (ffmi_score >= 21) { tier_num = 5; tier_classification = "Future Ready Farm"; }
        else if (ffmi_score >= 16) { tier_num = 4; tier_classification = "Investment Ready Farm"; }
        else if (ffmi_score >= 10) { tier_num = 3; tier_classification = "Structured Farm"; }
        else if (ffmi_score >= 5) { tier_num = 2; tier_classification = "Emerging Agribusiness"; }

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const strongestPillar = pillars.find((p) => p.id === parseInt(sorted[0][0], 10));
        const priorityGapPillar = pillars.find((p) => p.id === parseInt(sorted[sorted.length - 1][0], 10));

        // Update UI
        $("sim-result-tier").textContent = `Tier ${tier_num}: ${tier_classification}`;
        $("sim-result-ffmi").textContent = `${ffmi_score.toFixed(2)} / 24.00`;
        renderRiskBadge("sim-risk-badge", ffmi_score, lowestScore);

        $("sim-result-strongest").textContent = strongestPillar ? `${strongestPillar.name} (${(scores[strongestPillar.id] * 100).toFixed(0)}%)` : "—";
        $("sim-result-priority-gap").textContent = priorityGapPillar ? `${priorityGapPillar.name} (${(scores[priorityGapPillar.id] * 100).toFixed(0)}%)` : "—";

        // Visual Radar Chart for Simulator
        renderRadarChart("sim-radar-chart", scores);

        // Pillar Breakdown
        const ul = $("sim-result-pillars");
        ul.innerHTML = "";
        pillars.forEach((p) => {
            const li = document.createElement("li");
            const pct = Math.round((scores[p.id] || 0) * 100);
            li.textContent = `${p.name}: ${pct}%`;
            ul.appendChild(li);
        });

        // Recommendations
        const recs = $("sim-result-recommendations");
        recs.innerHTML = "";
        const weakPillars = pillars.filter((p) => (scores[p.id] || 0) < 0.70);
        const targetPillars = weakPillars.length ? weakPillars : [priorityGapPillar];

        targetPillars.slice(0, 5).forEach((wp) => {
            const li = document.createElement("li");
            li.className = "priority-quick_win";
            li.innerHTML = `
                <span class="priority-pill priority-quick_win">Quick Win</span>
                <p><strong>Develop baseline capability for ${wp.name}</strong></p>
                <p>Establish operational processes and standard records for ${wp.name}.</p>
                <p class="muted small">Learning: FAAB Transformation Module for ${wp.name}</p>
                <p class="muted small">Service: Future Farms Technical Advisory</p>
            `;
            recs.appendChild(li);
        });
    }

    function renderOfflineResult() {
        showScreen("result");
        $("result-tier").textContent = "Pending sync";
        $("result-ffmi").textContent = "—";
        $("result-strongest").textContent = "—";
        $("result-priority-gap").textContent = "—";
        $("result-pillars").innerHTML =
            "<li class='muted'>Your answers are saved locally. Connect to the internet and refresh to see your results.</li>";
        $("result-recommendations").innerHTML = "";
    }

    // ─── Service worker ─────────────────────────────────────────────
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/service-worker.js")
            .catch((e) => console.warn("Service worker registration failed:", e));
    }

    // ─── Online / offline indicator ─────────────────────────────────
    const offlineIndicator = $("offline-indicator");
    function updateOnlineStatus() {
        offlineIndicator.hidden = navigator.onLine;
    }
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();

    // ─── Wire up events ─────────────────────────────────────────────
    $("btn-start").addEventListener("click", startAssessment);
    $("btn-yes").addEventListener("click", () => answer("yes"));
    $("btn-no").addEventListener("click", () => answer("no"));
    $("btn-prev").addEventListener("click", previousQuestion);
    $("btn-skip").addEventListener("click", skipQuestion);
    const btnDownloadPdf = $("btn-download-pdf");
    if (btnDownloadPdf) btnDownloadPdf.addEventListener("click", downloadPdf);
    $("btn-restart").addEventListener("click", () => {
        state.assessmentId = null;
        state.answers = {};
        state.currentIndex = 0;
        state.result = null;
        showScreen("start");
    });

    // Navigation Tabs
    const navBtnAssessment = $("nav-btn-assessment");
    const navBtnSimulator = $("nav-btn-simulator");

    navBtnAssessment.addEventListener("click", () => {
        navBtnAssessment.classList.add("nav-tab-active");
        navBtnSimulator.classList.remove("nav-tab-active");
        if (state.result) showScreen("result");
        else if (state.assessmentId) showScreen("question");
        else showScreen("start");
    });

    navBtnSimulator.addEventListener("click", () => {
        navBtnSimulator.classList.add("nav-tab-active");
        navBtnAssessment.classList.remove("nav-tab-active");
        initSimulatorSliders();
        runSimulation();
        showScreen("simulator");
    });

    // ─── Bootstrap ──────────────────────────────────────────────────
    async function boot() {
        showScreen("loading");
        // Try refreshing from API, otherwise fall back to offline cache
        let { questions, pillars } = await refreshQuestionCache();
        if (!questions.length) {
            const cached = await loadCached();
            questions = cached.questions;
            pillars = cached.pillars;
        }
        // Sort by pillar then capability then question number
        questions.sort((a, b) => a.id.localeCompare(b.id));
        pillars.sort((a, b) => a.id - b.id);
        state.questions = questions;
        state.pillars = pillars;
        showScreen("start");
    }

    document.addEventListener("DOMContentLoaded", boot);
})();
