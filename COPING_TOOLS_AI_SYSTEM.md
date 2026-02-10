# AI-Driven Coping Tool Recommendation System

## 📋 Overview

The Coping Tools feature uses an **explainable AI recommendation engine** to suggest personalized, evidence-based coping techniques based on:
- Today's mood check-in
- Recent chat context (sentiment analysis)
- Clinical best practices for mental health support

This system is designed to be **future-ready** for integration with LLM APIs while maintaining clinical validity.

---

## 🏗️ Architecture

### Files Structure

```
src/
├── pages/
│   └── CopingTools.tsx            # Main UI component
├── lib/
│   ├── copingRecommendation.ts    # AI recommendation engine
│   └── copingToolsData.ts         # Evidence-based tools dataset
└── contexts/
    └── UserContext.tsx            # Provides checkIns, chatTags
```

### Data Flow

```
User Data (Local Storage)
    ↓
UserContext (checkIns, chatTags)
    ↓
buildRecommendationContext()
    ↓
RecommendationContext { currentMood, moodIntensity, recentChatSummary }
    ↓
getRecommendedCopingTools()
    ↓
RecommendedTool[] with scores + reasons
    ↓
CopingTools UI (sorted by relevance)
```

---

## 🧠 Recommendation Algorithm

### Scoring System (0-100 points)

Each coping tool receives a score based on:

| Factor | Points | Logic |
|--------|--------|-------|
| **Mood Compatibility** | 0-40 | 40 if tool supports current mood, 20 partial credit |
| **Chat Sentiment** | 0-30 | Crisis → breathing/grounding<br>Low mood → reflection/cognitive<br>Stress → movement/grounding |
| **Intensity Matching** | 0-20 | High mood intensity → high-impact tools<br>Low intensity → gentle tools |
| **Duration Preference** | 0-10 | Neutral/uncertain → prefer shorter tools |

### Sentiment Analysis Keywords

**Crisis Indicators** (prioritize breathing + grounding):
- panic, overwhelmed, heart racing, can't breathe, scared, terrified, anxiety attack, out of control, dizzy, shaking

**Low Mood Indicators** (prioritize affirmations + reflection):
- tired, hopeless, alone, sad, depressed, empty, worthless, numb, crying, heavy, dark

**Stress Indicators** (prioritize movement + body-based):
- stressed, overloaded, too much, pressure, deadline, exhausted, tense, tight, sore, headache

### Mood Intensity Mapping

```typescript
anxious: 8      // High - needs immediate calming
frustrated: 7   // High-medium
sad: 6          // Medium
neutral: 4      // Low-medium
calm: 3         // Low
happy: 2        // Very low
```

---

## 🛠️ Evidence-Based Coping Tools

### Breathing Techniques
1. **Box Breathing** (4-4-4-4)
   - Clinical Use: Trauma therapy, military stress management
   - Supported Moods: anxious, frustrated, neutral
   - Intensity: High | Duration: 2 min

2. **4-7-8 Breathing**
   - Clinical Use: Dr. Andrew Weil's relaxation technique
   - Supported Moods: anxious, frustrated, sad, neutral
   - Intensity: Medium | Duration: 3 min

3. **Simple Breathing** (4-4)
   - Clinical Use: General mindfulness practice
   - Supported Moods: anxious, frustrated, neutral, calm
   - Intensity: Low | Duration: 2 min

### Grounding Techniques
4. **5-4-3-2-1 Grounding**
   - Clinical Use: DBT distress tolerance skill
   - Supported Moods: anxious, frustrated, sad
   - Intensity: High | Duration: 3 min

5. **Body Scan Meditation**
   - Clinical Use: MBSR (Mindfulness-Based Stress Reduction)
   - Supported Moods: anxious, frustrated, neutral, calm
   - Intensity: Medium | Duration: 5 min

6. **Progressive Muscle Relaxation**
   - Clinical Use: Jacobson's relaxation technique
   - Supported Moods: anxious, frustrated, neutral
   - Intensity: Medium | Duration: 7 min

### Cognitive Techniques
7. **Cognitive Reframing**
   - Clinical Use: Core CBT technique for challenging thoughts
   - Supported Moods: anxious, sad, frustrated, neutral
   - Intensity: Medium | Duration: 5 min

8. **Thought Journaling**
   - Clinical Use: CBT/ACT-based cognitive defusion
   - Supported Moods: anxious, sad, frustrated, neutral
   - Intensity: Low | Duration: 10 min

### Reflection Techniques
9. **Self-Affirmations**
   - Clinical Use: Self-compassion therapy
   - Supported Moods: sad, frustrated, neutral, anxious
   - Intensity: Low | Duration: 2 min

10. **Gratitude Reflection**
    - Clinical Use: Positive psychology intervention
    - Supported Moods: sad, neutral, calm, happy
    - Intensity: Low | Duration: 3 min

11. **Self-Compassion Break**
    - Clinical Use: ACT, CFT (Compassion-Focused Therapy)
    - Supported Moods: sad, frustrated, anxious, neutral
    - Intensity: Low | Duration: 4 min

### Movement Techniques
12. **Movement Reset**
    - Clinical Use: Somatic therapy, embodied cognition research
    - Supported Moods: frustrated, anxious, neutral, happy
    - Intensity: Medium | Duration: 5 min

---

## 💡 Explainability (AI Transparency)

Every recommendation with score ≥ 50 shows a **reason** to the user:

### Example Explanations

```typescript
// Mood-based
"This technique is suggested because you felt anxious today."

// Chat + mood-based
"This technique is suggested because you felt anxious today and you mentioned feeling overwhelmed."

// Intensity-based
"This technique is suggested because you felt frustrated today and this offers quick relief."

// Generic
"This breathing technique is gentle and effective."
```

---

## 🔌 Future LLM Integration

### Current: Rule-Based Scoring

```typescript
function scoreTool(tool: CopingTool, context: RecommendationContext): number {
  // Hardcoded rules: mood matching, keyword detection, intensity logic
  return score;
}
```

### Future: LLM-Powered Scoring

```typescript
async function scoreTool(tool: CopingTool, context: RecommendationContext): Promise<number> {
  const prompt = `
    User Context:
    - Current Mood: ${context.currentMood}
    - Recent Chat: "${context.recentChatSummary}"
    
    Coping Tool:
    - Name: ${tool.title}
    - Category: ${tool.category}
    - Description: ${tool.description}
    
    Task: Score this tool's relevance (0-100) and explain why.
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  
  return extractScore(response);
}
```

### Migration Path

1. **Phase 1** (Current): Rule-based scoring with local data ✅
2. **Phase 2**: Hybrid - use LLM for explanation generation only
3. **Phase 3**: Full LLM scoring with clinical validation layer
4. **Phase 4**: Multi-modal (voice analysis, journal text, physiological data)

---

## 🧪 Testing the System

### Test Scenarios

#### Scenario 1: High Anxiety
```typescript
Context:
  currentMood: "anxious"
  moodIntensity: 8
  chatMessages: ["I'm having a panic attack", "Can't breathe"]

Expected Top Recommendations:
  1. Box Breathing (score ~90)
     Reason: "you felt anxious today and mentioned feeling overwhelmed"
  2. 5-4-3-2-1 Grounding (score ~85)
  3. 4-7-8 Breathing (score ~75)
```

#### Scenario 2: Low Mood
```typescript
Context:
  currentMood: "sad"
  moodIntensity: 6
  chatMessages: ["Feeling hopeless today", "Everything feels heavy"]

Expected Top Recommendations:
  1. Self-Compassion Break (score ~85)
     Reason: "you expressed feelings of sadness or hopelessness"
  2. Cognitive Reframing (score ~80)
  3. Gratitude Reflection (score ~70)
```

#### Scenario 3: Neutral/Unknown
```typescript
Context:
  currentMood: null
  moodIntensity: 5
  chatMessages: []

Expected Behavior:
  - All tools shown with balanced scores
  - Prefer shorter duration tools (≤3 min)
  - Generic explanations
```

---

## 🔧 Configuration & Customization

### Adding a New Coping Tool

1. **Update `copingToolsData.ts`**:
```typescript
{
  id: "new-technique",
  title: "New Technique",
  description: "Clinical description",
  category: "breathing", // breathing|grounding|cognitive|movement|reflection
  supportedMoods: ["anxious", "sad"] as Mood[],
  intensityLevel: "medium", // low|medium|high
  durationMinutes: 5,
  icon: IconComponent,
  color: "bg-mint text-mint-foreground",
  type: "new-technique",
}
```

2. **Add Dialog in `CopingTools.tsx`**:
```tsx
<Dialog open={activeTool === "new-technique"} onOpenChange={() => setActiveTool(null)}>
  <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-mint to-secondary sm:max-w-md">
    <DialogHeader>
      <DialogTitle>New Technique</DialogTitle>
    </DialogHeader>
    {/* ... content ... */}
  </DialogContent>
</Dialog>
```

3. **Update Click Handler**:
```tsx
onClick={() => {
  setActiveTool(tool.type);
  if (tool.type === "new-technique") initNewTechnique();
}}
```

### Adjusting Scoring Weights

Edit `copingRecommendation.ts`:

```typescript
// Increase mood compatibility weight
if (context.currentMood && tool.supportedMoods.includes(context.currentMood)) {
  score += 50; // Was 40
}

// Add new sentiment category
const FOCUS_KEYWORDS = ["distracted", "scattered", "unfocused"];
if (sentiment.hasFocusIssue && tool.category === "grounding") {
  score += 30;
}
```

---

## 📊 Analytics & Monitoring

### Tracking Recommendation Quality

To measure effectiveness, track:

1. **Click-Through Rate**: Which recommended tools are actually used?
2. **Mood Change**: Does mood improve after using recommended tool?
3. **Override Rate**: How often do users manually select different mood filters?
4. **Tool Diversity**: Are some tools never recommended?

### Future Analytics Hook

```typescript
// In CopingTools.tsx
const trackToolUsage = (toolId: string, score: number, reason: string) => {
  analytics.track("coping_tool_used", {
    tool_id: toolId,
    recommendation_score: score,
    recommendation_reason: reason,
    user_mood: recommendationContext.currentMood,
    chat_keywords: recommendationContext.chatKeywords,
  });
};
```

---

## 🛡️ Clinical Safety Guidelines

### Do's
✅ Base all techniques on peer-reviewed research  
✅ Include disclaimers for crisis situations  
✅ Provide breathing technique safety warnings (avoid if dizzy)  
✅ Offer diverse tool categories for user autonomy  
✅ Allow manual overrides of AI recommendations  

### Don'ts
❌ Never diagnose or claim to treat mental illness  
❌ Never recommend techniques that replace professional help  
❌ Never use stigmatizing language in explanations  
❌ Never recommend high-intensity tools for vulnerable states  
❌ Never force AI recommendations without user control  

---

## 🔍 Debugging

### Check Recommendation Context
```typescript
// In CopingTools.tsx, add temporary logging
console.log("Recommendation Context:", recommendationContext);
console.log("Top 3 Tools:", prioritizedTools.slice(0, 3).map(t => ({
  title: t.title,
  score: t.score,
  reason: t.reason,
})));
```

### Verify Scoring Logic
```typescript
// In copingRecommendation.ts
export function debugScoreTool(tool: CopingTool, context: RecommendationContext) {
  const breakdown = {
    moodScore: 0,
    sentimentScore: 0,
    intensityScore: 0,
    durationScore: 0,
  };
  
  // ... calculate each component ...
  
  console.log(`${tool.title}:`, breakdown);
  return breakdown;
}
```

---

## 📚 References

1. **Box Breathing**: Norelli et al. (2022). *Military Medicine*
2. **4-7-8 Breathing**: Weil, A. (2015). *Spontaneous Happiness*
3. **DBT Grounding**: Linehan, M. (2014). *DBT Skills Training Manual*
4. **MBSR Body Scan**: Kabat-Zinn, J. (2013). *Full Catastrophe Living*
5. **CBT Cognitive Reframing**: Beck, J. (2011). *Cognitive Behavior Therapy*
6. **ACT Self-Compassion**: Hayes, S. (2012). *Acceptance and Commitment Therapy*
7. **Gratitude Research**: Emmons & McCullough (2003). *Journal of Personality and Social Psychology*

---

## 🚀 Deployment Checklist

Before deploying changes:

- [ ] All tools have clinical references documented
- [ ] Scoring algorithm tested with 10+ test cases
- [ ] UI shows explanations for high-score tools (≥50)
- [ ] No TypeScript errors in recommendation engine
- [ ] Dialogs exist for all tool types
- [ ] Sentiment keyword lists reviewed for cultural appropriateness
- [ ] Crisis tool recommendations tested (panic scenarios)
- [ ] Performance tested with 100+ chat messages
- [ ] Accessibility: keyboard navigation in dialogs
- [ ] Mobile responsive: recommendation reasons don't overflow

---

## 💬 Support

For questions or improvements:
- **Technical Issues**: Check TypeScript errors in `copingRecommendation.ts`
- **Clinical Accuracy**: Consult licensed mental health professional
- **Algorithm Tuning**: Review scoring weights in `scoreTool()` function
- **New Tools**: Follow "Adding a New Coping Tool" guide above

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: AI-Assisted Development Team
