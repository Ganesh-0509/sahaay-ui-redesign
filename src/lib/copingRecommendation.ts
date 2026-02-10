/**
 * AI-Driven Coping Tool Recommendation Engine
 * 
 * This module provides intelligent, evidence-based coping tool recommendations
 * based on user mood, intensity, and recent chat sentiment.
 * 
 * Design Philosophy:
 * - Explainable AI: Every recommendation includes reasoning
 * - Future-ready: Can be replaced with LLM API calls
 * - Clinical validity: Uses only evidence-based techniques
 * - No hardcoding: Dynamic scoring based on context
 * 
 * @module copingRecommendation
 */

import type { Mood } from "@/types";

// ================================
// Type Definitions
// ================================

/**
 * Coping tool categories based on therapeutic approaches
 */
export type CopingCategory = "breathing" | "grounding" | "cognitive" | "movement" | "reflection";

/**
 * Intensity levels for tools (affects recommendation priority)
 */
export type IntensityLevel = "low" | "medium" | "high";

/**
 * Complete coping tool definition with clinical metadata
 */
export interface CopingTool {
  id: string;
  title: string;
  description: string;
  category: CopingCategory;
  supportedMoods: Mood[]; // Which moods this tool helps with
  intensityLevel: IntensityLevel; // How intensive the technique is
  durationMinutes: number; // Expected completion time
  icon: any; // Lucide icon component
  color: string; // Tailwind color classes
  type: string; // Internal type for dialog/action matching
}

/**
 * Recommended tool with explanation
 */
export interface RecommendedTool extends CopingTool {
  score: number; // Relevance score (0-100)
  reason: string; // Human-readable explanation
}

/**
 * Input context for recommendation engine
 */
export interface RecommendationContext {
  currentMood: Mood | null; // Today's most recent mood
  moodIntensity: number; // 1-10 scale (derived from mood type)
  recentChatSummary: string; // Last few chat messages concatenated
  chatKeywords: string[]; // Extracted keywords from chat
}

// ================================
// Sentiment & Keyword Analysis
// ================================

/**
 * Crisis/panic indicators (high priority for breathing + grounding)
 */
const CRISIS_KEYWORDS = [
  "panic", "overwhelmed", "heart racing", "can't breathe", "scared",
  "terrified", "anxiety attack", "out of control", "dizzy", "shaking"
];

/**
 * Low mood indicators (high priority for affirmations + reflection)
 */
const LOW_MOOD_KEYWORDS = [
  "tired", "hopeless", "alone", "sad", "depressed", "empty",
  "worthless", "numb", "crying", "heavy", "dark"
];

/**
 * Stress/overload indicators (high priority for movement + body-based)
 */
const STRESS_KEYWORDS = [
  "stressed", "overloaded", "too much", "pressure", "deadline",
  "exhausted", "tense", "tight", "sore", "headache"
];

/**
 * Analyzes chat text for sentiment keywords
 * 
 * @param chatText - Concatenated recent chat messages
 * @returns Array of matched keyword categories
 */
export function analyzeChatSentiment(chatText: string): {
  keywords: string[];
  hasCrisis: boolean;
  hasLowMood: boolean;
  hasStress: boolean;
} {
  const lower = chatText.toLowerCase();
  const keywords: string[] = [];
  
  const hasCrisis = CRISIS_KEYWORDS.some(kw => {
    if (lower.includes(kw)) {
      keywords.push(kw);
      return true;
    }
    return false;
  });
  
  const hasLowMood = LOW_MOOD_KEYWORDS.some(kw => {
    if (lower.includes(kw)) {
      keywords.push(kw);
      return true;
    }
    return false;
  });
  
  const hasStress = STRESS_KEYWORDS.some(kw => {
    if (lower.includes(kw)) {
      keywords.push(kw);
      return true;
    }
    return false;
  });
  
  return { keywords, hasCrisis, hasLowMood, hasStress };
}

// ================================
// Mood Intensity Mapping
// ================================

/**
 * Maps mood types to intensity levels (1-10)
 * Higher intensity = more urgent need for intervention
 */
export function getMoodIntensity(mood: Mood | null): number {
  const intensityMap: Record<Mood, number> = {
    anxious: 8, // High intensity - needs calming
    frustrated: 7, // High-medium intensity
    sad: 6, // Medium intensity
    neutral: 4, // Low-medium intensity
    calm: 3, // Low intensity
    happy: 2, // Very low intensity
  };
  
  return mood ? intensityMap[mood] : 5; // Default to medium
}

// ================================
// Core Recommendation Algorithm
// ================================

/**
 * Scores a coping tool based on context
 * 
 * Scoring logic:
 * 1. Base compatibility with current mood (0-40 points)
 * 2. Chat sentiment alignment (0-30 points)
 * 3. Intensity matching (0-20 points)
 * 4. Duration preference (0-10 points)
 * 
 * @param tool - The coping tool to score
 * @param context - Current user context
 * @returns Score from 0-100
 */
function scoreTool(tool: CopingTool, context: RecommendationContext): number {
  let score = 0;
  
  // 1. MOOD COMPATIBILITY (0-40 points)
  if (context.currentMood && tool.supportedMoods.includes(context.currentMood)) {
    score += 40;
  } else if (context.currentMood) {
    // Partial credit for general applicability
    score += 20;
  }
  
  // 2. CHAT SENTIMENT ALIGNMENT (0-30 points)
  const sentiment = analyzeChatSentiment(context.recentChatSummary);
  
  if (sentiment.hasCrisis) {
    // RULE: Crisis → breathing + grounding first
    if (tool.category === "breathing" || tool.category === "grounding") {
      score += 30;
    }
  } else if (sentiment.hasLowMood) {
    // RULE: Low mood → affirmations + reflection first
    if (tool.category === "reflection" || tool.category === "cognitive") {
      score += 30;
    }
  } else if (sentiment.hasStress) {
    // RULE: Stress → movement + body-based first
    if (tool.category === "movement" || tool.category === "grounding") {
      score += 30;
    }
  }
  
  // 3. INTENSITY MATCHING (0-20 points)
  // High mood intensity → prefer quick, high-impact tools
  if (context.moodIntensity >= 7) {
    if (tool.intensityLevel === "high") score += 20;
    if (tool.intensityLevel === "medium") score += 10;
  } else if (context.moodIntensity >= 4) {
    if (tool.intensityLevel === "medium") score += 20;
    if (tool.intensityLevel === "low") score += 15;
  } else {
    // Low intensity → prefer gentle tools
    if (tool.intensityLevel === "low") score += 20;
    if (tool.intensityLevel === "medium") score += 10;
  }
  
  // 4. DURATION PREFERENCE (0-10 points)
  // NEUTRAL/unsure → prefer shorter duration tools
  if (!context.currentMood || context.currentMood === "neutral") {
    if (tool.durationMinutes <= 3) score += 10;
    else if (tool.durationMinutes <= 5) score += 5;
  }
  
  return Math.min(score, 100); // Cap at 100
}

/**
 * Generates human-readable explanation for recommendation
 * 
 * @param tool - The recommended tool
 * @param context - User context
 * @returns Explanation string
 */
function generateExplanation(tool: CopingTool, context: RecommendationContext): string {
  const reasons: string[] = [];
  const sentiment = analyzeChatSentiment(context.recentChatSummary);
  
  // Add mood-based reasoning
  if (context.currentMood) {
    const moodLabel = context.currentMood;
    reasons.push(`you felt ${moodLabel} today`);
  }
  
  // Add chat-based reasoning
  if (sentiment.hasCrisis && (tool.category === "breathing" || tool.category === "grounding")) {
    reasons.push("you mentioned feeling overwhelmed");
  } else if (sentiment.hasLowMood && (tool.category === "reflection" || tool.category === "cognitive")) {
    reasons.push("you expressed feelings of sadness or hopelessness");
  } else if (sentiment.hasStress && (tool.category === "movement" || tool.category === "grounding")) {
    reasons.push("you mentioned feeling stressed or tense");
  }
  
  // Add intensity reasoning
  if (context.moodIntensity >= 7 && tool.intensityLevel === "high") {
    reasons.push("this offers quick relief");
  }
  
  // Construct final explanation
  if (reasons.length === 0) {
    return `This ${tool.category} technique is gentle and effective.`;
  }
  
  const reasonText = reasons.join(" and ");
  return `This technique is suggested because ${reasonText}.`;
}

/**
 * Main recommendation engine
 * 
 * Analyzes context and returns prioritized, scored coping tools
 * with explanations for each recommendation.
 * 
 * @param tools - All available coping tools
 * @param context - Current user context
 * @returns Sorted array of recommended tools with scores and reasons
 */
export function getRecommendedCopingTools(
  tools: CopingTool[],
  context: RecommendationContext
): RecommendedTool[] {
  // Score all tools
  const scoredTools: RecommendedTool[] = tools.map(tool => ({
    ...tool,
    score: scoreTool(tool, context),
    reason: generateExplanation(tool, context),
  }));
  
  // Sort by score (highest first)
  scoredTools.sort((a, b) => b.score - a.score);
  
  return scoredTools;
}

/**
 * Creates recommendation context from local storage data
 * 
 * This is a helper to bridge local storage data into the recommendation engine.
 * In the future, this can be replaced with Firestore queries.
 * 
 * @param checkIns - Recent mood check-ins
 * @param chatMessages - Recent chat messages (if available)
 * @returns Recommendation context
 */
export function buildRecommendationContext(
  checkIns: Array<{ mood: Mood; createdAt: string }>,
  chatMessages?: Array<{ text: string }>,
): RecommendationContext {
  // Get today's most recent mood
  const today = new Date().toDateString();
  const todayCheckIns = checkIns.filter(item => 
    new Date(item.createdAt).toDateString() === today
  );
  const currentMood = todayCheckIns.length > 0 ? todayCheckIns[0].mood : null;
  
  // Calculate mood intensity
  const moodIntensity = getMoodIntensity(currentMood);
  
  // Build chat summary (last 5 messages)
  const recentChatSummary = chatMessages
    ? chatMessages.slice(0, 5).map(m => m.text).join(" ")
    : "";
  
  // Extract keywords
  const { keywords } = analyzeChatSentiment(recentChatSummary);
  
  return {
    currentMood,
    moodIntensity,
    recentChatSummary,
    chatKeywords: keywords,
  };
}
