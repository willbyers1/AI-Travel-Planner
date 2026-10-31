var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    hasMapsKey: Boolean(process.env.GOOGLE_MAPS_PLATFORM_KEY)
  });
});
app.post("/api/generate-trip", async (req, res) => {
  try {
    const {
      destination,
      days = 3,
      totalBudget = 1e3,
      currency = "USD",
      travelStyle = "Balanced",
      interests = ["History", "Food", "Culture"],
      foodPreferences = "",
      additionalNotes = "",
      customOpenAIKey = "",
      customGeminiKey = ""
    } = req.body || {};
    if (!destination || typeof destination !== "string" || !destination.trim()) {
      return res.status(400).json({ error: "Destination is required." });
    }
    const numDays = Math.min(Math.max(Number(days) || 1, 1), 30);
    const budgetVal = Math.max(Number(totalBudget) || 100, 10);
    const apiKey = customGeminiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const openAiKey = customOpenAIKey || process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (!apiKey && !openAiKey) {
      return res.status(400).json({
        error: "No AI API Key found. Please add GEMINI_API_KEY or OPENAI_API_KEY in AI Studio Settings -> Secrets or provide it in the request."
      });
    }
    const promptText = `Generate a detailed, structured, highly realistic ${numDays}-day travel itinerary for a trip to "${destination}".
    Trip Details:
    - Target Total Budget: ${budgetVal} ${currency}
    - Duration: ${numDays} days
    - Travel Style: ${travelStyle}
    - User Interests: ${Array.isArray(interests) ? interests.join(", ") : interests}
    - Food Preferences: ${foodPreferences || "None"}
    - Additional Notes/Requests: ${additionalNotes || "None"}

    Requirements:
    1. Provide a overall summary of the trip.
    2. Provide a realistic budget breakdown: totalEstimatedCost, dailyAverage, foodEstimate, activitiesEstimate, transportationEstimate, stayEstimate, and remainingBudget (${budgetVal} - totalEstimatedCost).
    3. Generate EXACTLY ${numDays} day(s) in the 'days' array.
    4. Each day must have a title, estimatedDailyCost, and a sequence of 3 to 5 realistic activities (Morning, Lunch, Afternoon, Evening/Dinner).
    5. Each activity must include:
       - name (e.g., "Eiffel Tower", "Louvre Museum", "Le Petit Cambodge")
       - type: one of "attraction", "restaurant", "activity", "transport", "hotel"
       - description: 2-3 sentence engaging explanation
       - estimatedCost: cost in ${currency}
       - durationMinutes: integer
       - time: string representation (e.g. "09:00 AM - 11:30 AM")
       - location: { name: string, address: string } (Provide complete address in ${destination})
       - tips: optional practical advice
    6. Provide 4-6 actionable general travel tips for visiting ${destination} (local customs, transportation, safety, best times).
    `;
    let itineraryData = null;
    if (apiKey) {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const responseSchema = {
        type: import_genai.Type.OBJECT,
        properties: {
          summary: { type: import_genai.Type.STRING },
          totalEstimatedCost: { type: import_genai.Type.NUMBER },
          currency: { type: import_genai.Type.STRING },
          budgetBreakdown: {
            type: import_genai.Type.OBJECT,
            properties: {
              totalEstimatedCost: { type: import_genai.Type.NUMBER },
              dailyAverage: { type: import_genai.Type.NUMBER },
              foodEstimate: { type: import_genai.Type.NUMBER },
              activitiesEstimate: { type: import_genai.Type.NUMBER },
              transportationEstimate: { type: import_genai.Type.NUMBER },
              stayEstimate: { type: import_genai.Type.NUMBER },
              remainingBudget: { type: import_genai.Type.NUMBER }
            },
            required: ["totalEstimatedCost", "dailyAverage", "foodEstimate", "activitiesEstimate", "transportationEstimate", "remainingBudget"]
          },
          days: {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                day: { type: import_genai.Type.INTEGER },
                title: { type: import_genai.Type.STRING },
                estimatedDailyCost: { type: import_genai.Type.NUMBER },
                activities: {
                  type: import_genai.Type.ARRAY,
                  items: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      time: { type: import_genai.Type.STRING },
                      name: { type: import_genai.Type.STRING },
                      type: { type: import_genai.Type.STRING },
                      description: { type: import_genai.Type.STRING },
                      estimatedCost: { type: import_genai.Type.NUMBER },
                      durationMinutes: { type: import_genai.Type.INTEGER },
                      location: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          name: { type: import_genai.Type.STRING },
                          address: { type: import_genai.Type.STRING },
                          lat: { type: import_genai.Type.NUMBER },
                          lng: { type: import_genai.Type.NUMBER }
                        },
                        required: ["name", "address"]
                      },
                      tips: { type: import_genai.Type.STRING }
                    },
                    required: ["time", "name", "type", "description", "estimatedCost", "durationMinutes", "location"]
                  }
                }
              },
              required: ["day", "title", "estimatedDailyCost", "activities"]
            }
          },
          tips: {
            type: import_genai.Type.ARRAY,
            items: { type: import_genai.Type.STRING }
          }
        },
        required: ["summary", "totalEstimatedCost", "currency", "budgetBreakdown", "days", "tips"]
      };
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.7
        }
      });
      const responseText = geminiResponse.text;
      if (!responseText) {
        throw new Error("Gemini API returned an empty response.");
      }
      itineraryData = JSON.parse(responseText);
    } else if (openAiKey) {
      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a expert travel planner assistant. Respond ONLY with valid JSON complying with the requested schema."
            },
            {
              role: "user",
              content: promptText
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });
      if (!openAiRes.ok) {
        const errText = await openAiRes.text();
        throw new Error(`OpenAI API error (${openAiRes.status}): ${errText}`);
      }
      const openAiJson = await openAiRes.json();
      const content = openAiJson.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI returned no text content.");
      }
      itineraryData = JSON.parse(content);
    }
    if (!itineraryData) {
      throw new Error("Failed to generate itinerary structure.");
    }
    const tripId = "trip_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const nowISO = (/* @__PURE__ */ new Date()).toISOString();
    const formattedDays = (itineraryData.days || []).map((dayObj, dIndex) => ({
      day: dayObj.day || dIndex + 1,
      title: dayObj.title || `Day ${dIndex + 1}: Exploring ${destination}`,
      estimatedDailyCost: Number(dayObj.estimatedDailyCost) || 0,
      activities: (dayObj.activities || []).map((act, aIndex) => ({
        id: `act_${dIndex + 1}_${aIndex + 1}_${Date.now()}`,
        time: act.time || "Flexible",
        name: act.name || "Points of Interest",
        type: ["attraction", "restaurant", "activity", "transport", "hotel"].includes(act.type) ? act.type : "attraction",
        description: act.description || `Visit ${act.name || "destination"}`,
        estimatedCost: Number(act.estimatedCost) || 0,
        durationMinutes: Number(act.durationMinutes) || 60,
        location: {
          name: act.location?.name || act.name || destination,
          address: act.location?.address || `${act.name || destination}, ${destination}`,
          lat: typeof act.location?.lat === "number" ? act.location.lat : void 0,
          lng: typeof act.location?.lng === "number" ? act.location.lng : void 0
        },
        tips: act.tips || void 0
      }))
    }));
    const totalCostCalc = formattedDays.reduce(
      (sum, d) => sum + d.estimatedDailyCost,
      0
    );
    const tripResult = {
      id: tripId,
      createdAt: nowISO,
      updatedAt: nowISO,
      name: `${numDays}-Day ${travelStyle} Trip to ${destination}`,
      request: {
        destination,
        days: numDays,
        totalBudget: budgetVal,
        currency,
        travelStyle,
        interests: Array.isArray(interests) ? interests : [interests],
        foodPreferences,
        additionalNotes
      },
      summary: itineraryData.summary || `A customized ${numDays}-day ${travelStyle.toLowerCase()} itinerary in ${destination} focusing on ${Array.isArray(interests) ? interests.join(", ") : "local culture"}.`,
      currency,
      totalEstimatedCost: itineraryData.totalEstimatedCost || totalCostCalc || Math.round(budgetVal * 0.85),
      budgetBreakdown: {
        totalEstimatedCost: itineraryData.budgetBreakdown?.totalEstimatedCost || itineraryData.totalEstimatedCost || totalCostCalc || Math.round(budgetVal * 0.85),
        dailyAverage: itineraryData.budgetBreakdown?.dailyAverage || Math.round((totalCostCalc || budgetVal * 0.85) / numDays),
        foodEstimate: itineraryData.budgetBreakdown?.foodEstimate || Math.round(budgetVal * 0.35),
        activitiesEstimate: itineraryData.budgetBreakdown?.activitiesEstimate || Math.round(budgetVal * 0.35),
        transportationEstimate: itineraryData.budgetBreakdown?.transportationEstimate || Math.round(budgetVal * 0.15),
        stayEstimate: itineraryData.budgetBreakdown?.stayEstimate || Math.round(budgetVal * 0.15),
        remainingBudget: Math.max(
          0,
          budgetVal - (itineraryData.totalEstimatedCost || totalCostCalc || Math.round(budgetVal * 0.85))
        )
      },
      days: formattedDays,
      tips: Array.isArray(itineraryData.tips) && itineraryData.tips.length > 0 ? itineraryData.tips : [
        `Pack comfortable walking shoes for exploring ${destination}.`,
        "Keep local currency cash for smaller shops and local markets.",
        "Use public transport passes for budget-friendly city navigation.",
        "Check opening hours of major museums and attractions in advance."
      ]
    };
    return res.json(tripResult);
  } catch (err) {
    console.error("Error generating trip:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate travel itinerary. Please try again."
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
