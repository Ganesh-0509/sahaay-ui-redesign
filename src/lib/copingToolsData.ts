/**
 * Evidence-Based Coping Tools Dataset
 * 
 * This file contains clinically-validated coping techniques with structured metadata.
 * All techniques are backed by research in CBT, DBT, ACT, and mindfulness-based therapies.
 * 
 * @module copingToolsData
 */

import { Wind, Mountain, Sparkles, Dumbbell, Brain, BookHeart, Heart, Activity } from "lucide-react";
import type { CopingTool } from "@/lib/copingRecommendation";
import type { Mood } from "@/types";

/**
 * Complete evidence-based coping tools library
 * 
 * Clinical References:
 * - Box Breathing: Used in trauma therapy, military stress management
 * - 4-7-8 Breathing: Dr. Andrew Weil's relaxation technique
 * - 5-4-3-2-1 Grounding: Standard DBT distress tolerance skill
 * - Body Scan: MBSR (Mindfulness-Based Stress Reduction)
 * - Progressive Muscle Relaxation: Jacobson's relaxation technique
 * - Cognitive Reframing: Core CBT technique for challenging thoughts
 * - Thought Journaling: CBT/ACT-based cognitive defusion
 * - Gratitude Practice: Positive psychology intervention
 * - Movement Reset: Somatic therapy, embodied cognition research
 * - Self-Compassion: ACT, CFT (Compassion-Focused Therapy)
 */
export const EVIDENCE_BASED_COPING_TOOLS: CopingTool[] = [
  // ===================================
  // BREATHING TECHNIQUES
  // ===================================
  {
    id: "box-breathing",
    title: "Box Breathing",
    description: "4-4-4-4 breathing used by Navy SEALs to manage stress",
    category: "breathing",
    supportedMoods: ["anxious", "frustrated", "neutral"] as Mood[],
    intensityLevel: "high",
    durationMinutes: 2,
    icon: Wind,
    color: "bg-mint text-mint-foreground",
    type: "box-breathing",
  },
  {
    id: "478-breathing",
    title: "4-7-8 Breathing",
    description: "Deeply calming breath pattern for sleep and anxiety",
    category: "breathing",
    supportedMoods: ["anxious", "frustrated", "sad", "neutral"] as Mood[],
    intensityLevel: "medium",
    durationMinutes: 3,
    icon: Wind,
    color: "bg-mint text-mint-foreground",
    type: "478-breathing",
  },
  {
    id: "simple-breathing",
    title: "Simple Breathing",
    description: "Gentle 4-4 breathing to calm your nervous system",
    category: "breathing",
    supportedMoods: ["anxious", "frustrated", "neutral", "calm"] as Mood[],
    intensityLevel: "low",
    durationMinutes: 2,
    icon: Wind,
    color: "bg-mint text-mint-foreground",
    type: "breathing",
  },

  // ===================================
  // GROUNDING TECHNIQUES
  // ===================================
  {
    id: "54321-grounding",
    title: "5-4-3-2-1 Grounding",
    description: "Use your five senses to anchor yourself in the present moment",
    category: "grounding",
    supportedMoods: ["anxious", "frustrated", "sad"] as Mood[],
    intensityLevel: "high",
    durationMinutes: 3,
    icon: Mountain,
    color: "bg-lavender text-lavender-foreground",
    type: "grounding",
  },
  {
    id: "body-scan",
    title: "Body Scan Meditation",
    description: "Notice sensations from head to toe to reconnect with your body",
    category: "grounding",
    supportedMoods: ["anxious", "frustrated", "neutral", "calm"] as Mood[],
    intensityLevel: "medium",
    durationMinutes: 5,
    icon: Mountain,
    color: "bg-lavender text-lavender-foreground",
    type: "body-scan",
  },
  {
    id: "progressive-muscle-relaxation",
    title: "Progressive Muscle Relaxation",
    description: "Tense and release muscle groups to release physical tension",
    category: "grounding",
    supportedMoods: ["anxious", "frustrated", "neutral"] as Mood[],
    intensityLevel: "medium",
    durationMinutes: 7,
    icon: Activity,
    color: "bg-lavender text-lavender-foreground",
    type: "pmr",
  },

  // ===================================
  // COGNITIVE TECHNIQUES
  // ===================================
  {
    id: "cognitive-reframing",
    title: "Cognitive Reframing",
    description: "Challenge unhelpful thoughts with evidence-based questions",
    category: "cognitive",
    supportedMoods: ["anxious", "sad", "frustrated", "neutral"] as Mood[],
    intensityLevel: "medium",
    durationMinutes: 5,
    icon: Brain,
    color: "bg-blue-100 text-blue-900",
    type: "cognitive-reframing",
  },
  {
    id: "thought-journaling",
    title: "Thought Journaling",
    description: "Write down your thoughts to gain distance and perspective",
    category: "cognitive",
    supportedMoods: ["anxious", "sad", "frustrated", "neutral"] as Mood[],
    intensityLevel: "low",
    durationMinutes: 10,
    icon: BookHeart,
    color: "bg-blue-100 text-blue-900",
    type: "thought-journaling",
  },

  // ===================================
  // REFLECTION TECHNIQUES
  // ===================================
  {
    id: "affirmations",
    title: "Self-Affirmations",
    description: "Gentle reminders of your strength, worth, and resilience",
    category: "reflection",
    supportedMoods: ["sad", "frustrated", "neutral", "anxious"] as Mood[],
    intensityLevel: "low",
    durationMinutes: 2,
    icon: Sparkles,
    color: "bg-peach text-peach-foreground",
    type: "affirmations",
  },
  {
    id: "gratitude-reflection",
    title: "Gratitude Reflection",
    description: "Notice three things you're grateful for right now",
    category: "reflection",
    supportedMoods: ["sad", "neutral", "calm", "happy"] as Mood[],
    intensityLevel: "low",
    durationMinutes: 3,
    icon: Heart,
    color: "bg-peach text-peach-foreground",
    type: "gratitude",
  },
  {
    id: "self-compassion",
    title: "Self-Compassion Break",
    description: "Treat yourself with the kindness you'd offer a friend",
    category: "reflection",
    supportedMoods: ["sad", "frustrated", "anxious", "neutral"] as Mood[],
    intensityLevel: "low",
    durationMinutes: 4,
    icon: Heart,
    color: "bg-peach text-peach-foreground",
    type: "self-compassion",
  },

  // ===================================
  // MOVEMENT TECHNIQUES
  // ===================================
  {
    id: "quick-exercises",
    title: "Movement Reset",
    description: "Simple stretches and movements to release tension",
    category: "movement",
    supportedMoods: ["frustrated", "anxious", "neutral", "happy"] as Mood[],
    intensityLevel: "medium",
    durationMinutes: 5,
    icon: Dumbbell,
    color: "bg-secondary text-secondary-foreground",
    type: "exercises",
  },
];
