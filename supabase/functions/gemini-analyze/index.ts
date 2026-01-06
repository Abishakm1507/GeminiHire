import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeBase64, jobDescription, fileName, mimeType } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt for resume parsing
    const systemPrompt = `You are an expert resume analyzer. Extract structured data from resumes with precision.
    
Your task is to analyze a resume and extract the following information in JSON format:
1. name: Full name of the candidate
2. email: Email address (if present)
3. phone: Phone number (if present)
4. skills: Array of technical and soft skills
5. experience: Array of work experience objects with {title, company, duration, description}
6. education: Array of education objects with {degree, institution, year}
7. summary: A brief professional summary (2-3 sentences)

Be thorough and extract ALL skills mentioned, including those embedded in job descriptions.`;

    // Call Gemini for resume parsing
    const parseResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this resume and extract the structured data. Return ONLY valid JSON, no markdown or additional text.",
              },
              {
                type: "image_url",
                image_url: {
                  url: resumeBase64,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!parseResponse.ok) {
      const errorText = await parseResponse.text();
      console.error("Gemini API error:", parseResponse.status, errorText);
      throw new Error(`AI parsing failed: ${parseResponse.status}`);
    }

    const parseData = await parseResponse.json();
    const parseContent = parseData.choices?.[0]?.message?.content || "";
    
    // Extract JSON from the response
    let resumeData;
    try {
      const jsonMatch = parseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resumeData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("Failed to parse resume JSON:", parseContent);
      // Fallback structure
      resumeData = {
        name: "Unknown Candidate",
        email: null,
        phone: null,
        skills: ["Unable to parse skills"],
        experience: [],
        education: [],
        summary: "Resume parsing encountered an issue. Please try again.",
      };
    }

    // Now analyze skill gaps
    const skillGapPrompt = `You are an expert career advisor. Compare the candidate's skills against a job description.

RESUME SKILLS: ${JSON.stringify(resumeData.skills)}

JOB DESCRIPTION:
${jobDescription}

Analyze and return JSON with:
1. matchedSkills: Array of skills from the resume that match the job requirements
2. missingSkills: Array of skills required by the job but not in the resume (max 5 most important)
3. matchPercentage: A number 0-100 representing how well the candidate matches
4. learningPaths: Array of {skill, resources: ["resource1", "resource2"], estimatedTime: "X weeks/months"} for top 3 missing skills

Return ONLY valid JSON, no markdown.`;

    const gapResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a career advisor. Return only valid JSON." },
          { role: "user", content: skillGapPrompt },
        ],
      }),
    });

    if (!gapResponse.ok) {
      throw new Error("Skill gap analysis failed");
    }

    const gapData = await gapResponse.json();
    const gapContent = gapData.choices?.[0]?.message?.content || "";

    let skillGap;
    try {
      const jsonMatch = gapContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        skillGap = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (e) {
      console.error("Failed to parse skill gap JSON:", gapContent);
      skillGap = {
        matchedSkills: resumeData.skills.slice(0, 5),
        missingSkills: ["Analysis pending"],
        matchPercentage: 70,
        learningPaths: [],
      };
    }

    return new Response(
      JSON.stringify({
        resumeData,
        skillGap,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("gemini-analyze error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
