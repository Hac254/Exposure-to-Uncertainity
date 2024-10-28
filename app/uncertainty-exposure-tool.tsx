'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Wind, Brain, Lightbulb, Feather } from 'lucide-react'

const breathworkInstructions = [
  { text: "Inhale", duration: 4000, scale: 1.2 },
  { text: "Hold", duration: 4000, scale: 1.2 },
  { text: "Exhale", duration: 6000, scale: 1 },
  { text: "Hold", duration: 2000, scale: 1 }
]

const commonUncertainties = [
  "I don't know how my work project will turn out",
  "I'm unsure about my relationship's future",
  "I'm worried about my health test results",
  "I don't know if I'll get the job I applied for",
  "I'm uncertain about my financial future"
]

export default function UncertaintyExposureTool() {
  const [stage, setStage] = useState(-1) // Start with splash screen
  const [uncertainty, setUncertainty] = useState('')
  const [thoughts, setThoughts] = useState('')
  const [feelings, setFeelings] = useState('')
  const [reflection, setReflection] = useState('')
  const [breathIndex, setBreathIndex] = useState(0)
  const [breathProgress, setBreathProgress] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathScale, setBreathScale] = useState(1)
  const [discomfortTime, setDiscomfortTime] = useState(60)
  const [discomfortProgress, setDiscomfortProgress] = useState(0)
  const [showCommonUncertainties, setShowCommonUncertainties] = useState(false)
  const [anxietyLevel, setAnxietyLevel] = useState(5)
  const breathInterval = useRef<NodeJS.Timeout | null>(null)
  const discomfortInterval = useRef<NodeJS.Timeout | null>(null)

  const startBreathing = () => {
    setIsBreathing(true)
    breathCycle()
  }

  const breathCycle = () => {
    if (!isBreathing) return;

    const currentInstruction = breathworkInstructions[breathIndex]
    let progress = 0
    const intervalTime = 50 // Update every 50ms for smooth animation

    setBreathScale(currentInstruction.scale)

    breathInterval.current = setInterval(() => {
      if (!isBreathing) {
        if (breathInterval.current) clearInterval(breathInterval.current)
        return;
      }

      progress += (intervalTime / currentInstruction.duration) * 100
      setBreathProgress(progress)

      if (progress >= 100) {
        setBreathIndex((prevIndex) => (prevIndex + 1) % breathworkInstructions.length)
        if (breathInterval.current) clearInterval(breathInterval.current)
        breathCycle()
      }
    }, intervalTime)
  }

  const stopBreathing = () => {
    setIsBreathing(false)
    setBreathProgress(0)
    setBreathScale(1)
    setBreathIndex(0)
    if (breathInterval.current) {
      clearInterval(breathInterval.current)
    }
  }

  useEffect(() => {
    if (isBreathing) {
      breathCycle()
    }
    return () => {
      if (breathInterval.current) clearInterval(breathInterval.current)
    }
  }, [isBreathing, breathIndex])

  const startDiscomfortTimer = () => {
    discomfortInterval.current = setInterval(() => {
      setDiscomfortProgress((prev) => {
        if (prev >= 100) {
          clearInterval(discomfortInterval.current!)
          return 100
        }
        return prev + (100 / discomfortTime)
      })
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (breathInterval.current) clearInterval(breathInterval.current)
      if (discomfortInterval.current) clearInterval(discomfortInterval.current)
    }
  }, [])

  const nextStage = () => {
    setStage((prev) => prev + 1)
    setThoughts('')
    setFeelings('')
    setReflection('')
  }

  const prevStage = () => {
    setStage((prev) => prev - 1)
  }

  const stages = [
    // Splash Screen
    <motion.div
      key="splash"
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-6xl font-bold text-pink-500 mb-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        Embrace Uncertainty
      </motion.div>
      <motion.div
        className="w-64 h-64 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 mb-8"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <Button onClick={() => setStage(0)} className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg">
        Start Your Journey
      </Button>
    </motion.div>,

    // Stage 0: Identify an Uncertainty Trigger
    <Card key="stage-0" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Identify Your Uncertainty</CardTitle>
        <CardDescription>What is something uncertain that is causing you anxiety right now?</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={uncertainty}
          onChange={(e) => setUncertainty(e.target.value)}
          placeholder="Type your uncertainty here..."
          className="mb-4"
        />
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="show-common"
            checked={showCommonUncertainties}
            onCheckedChange={setShowCommonUncertainties}
          />
          <Label htmlFor="show-common">Show common uncertainties</Label>
        </div>
        {showCommonUncertainties && (
          <div className="space-y-2">
            {commonUncertainties.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={() => setUncertainty(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={nextStage} disabled={!uncertainty.trim()} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Stage 1: Breathwork
    <Card key="stage-1" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Breathwork</CardTitle>
        <CardDescription>Take a moment to center yourself with some deep breaths.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <motion.div
            className="absolute inset-0 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            animate={{
              scale: breathScale,
            }}
            transition={{
              duration: breathworkInstructions[breathIndex].duration / 1000,
            }}
          >
            {breathworkInstructions[breathIndex].text}
          </motion.div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="301.59"
              strokeDashoffset={301.59 - (breathProgress / 100) * 301.59}
            />
          </svg>
        </div>
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">{breathworkInstructions[breathIndex].text}</p>
          <p className="text-sm text-gray-500">
            for {breathworkInstructions[breathIndex].duration / 1000} seconds
          </p>
        </div>
        <Button onClick={isBreathing ? stopBreathing : startBreathing} className="mt-4 mb-4 bg-pink-500 hover:bg-pink-600 text-white">
          {isBreathing ? 'Stop' : 'Start'} Breathing Exercise
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStage} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStage} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Stage 2: Observe the Thoughts and Feelings
    <Card key="stage-2" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Observe Your Thoughts and Feelings</CardTitle>
        <CardDescription>Take a moment to notice what's happening in your mind and body.</CardDescription>
      </CardHeader>
      <CardContent>
        <label className="block mb-2">What thoughts come up as you think about this uncertainty?</label>
        <Textarea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Type your thoughts here..."
          className="mb-4"
        />
        <label className="block mb-2">How does your body feel?</label>
        <Textarea
          value={feelings}
          onChange={(e) => setFeelings(e.target.value)}
          placeholder="Describe your physical sensations..."
          className="mb-4"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStage} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStage} disabled={!thoughts.trim() || !feelings.trim()} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Stage 3: Stay with the Discomfort
    <Card key="stage-3" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Stay with the Discomfort</CardTitle>
        <CardDescription>Allow yourself to be present with the uncertainty without trying to change it.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Set a timer for how long you'd like to sit with this feeling (1-3 minutes):</p>
        <Slider
          value={[discomfortTime]}
          onValueChange={(value) => setDiscomfortTime(value[0])}
          max={180}
          step={10}
          className="mb-4"
        />
        <p className="text-center mb-4">{Math.floor(discomfortTime / 60)}:{(discomfortTime % 60).toString().padStart(2, '0')}</p>
        {discomfortProgress > 0 && <Progress value={discomfortProgress} className="mb-4" />}
        <Button onClick={startDiscomfortTimer} disabled={discomfortProgress > 0} className="w-full mb-4 bg-pink-500 hover:bg-pink-600 text-white">
          Start Timer
        </Button>
        <p className="text-center">
          Allow the discomfort to be there without pushing it away. Notice how it feels in your body and mind. It's okay not to have answers right now.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStage} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStage} disabled={discomfortProgress < 100} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Stage 4: Non-Judgmental Stance
    <Card key="stage-4" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Non-Judgmental Observation</CardTitle>
        <CardDescription>Notice your thoughts without labeling them as good or bad.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Now notice any judgment you have about your thoughts. Try to observe them without labeling them as 'right' or 'wrong.' They're just thoughts, and they will pass.
        </p>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Reflect on how your thoughts may feel less intense or neutral now..."
          className="mb-4"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStage} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStage} disabled={!reflection.trim()} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      
      </CardFooter>
    </Card>,

    // Stage 5: Letting Go of Control
    <Card key="stage-5" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Letting Go of Control</CardTitle>
        <CardDescription>Visualize releasing your need for certainty.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Imagine yourself holding your uncertainty in your hands. Now, gently open your hands and let it float away, releasing the need to control the outcome.
        </p>
        <motion.div
          className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4"
          animate={{
            y: [0, -50],
            opacity: [1, 0],
            scale: [1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="How does this visualization make you feel?"
          className="mb-4"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStage} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStage} disabled={!reflection.trim()} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>,

    // Stage 6: Final Reflection
    <Card key="stage-6" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Final Reflection</CardTitle>
        <CardDescription>Take a moment to reflect on your experience.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">How did focusing on your breath help you stay grounded?</p>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Your reflection..."
          className="mb-4"
        />
        <p className="mb-2">What did you notice about accepting your feelings instead of trying to change them?</p>
        <Textarea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Your thoughts..."
          className="mb-4"
        />
        <p className="mb-2">Rate your current anxiety level:</p>
        <Slider
          value={[anxietyLevel]}
          onValueChange={(value) => setAnxietyLevel(value[0])}
          max={10}
          step={1}
          className="mb-4"
        />
        <p className="text-center">Anxiety Level: {anxietyLevel}/10</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStage} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={() => setStage(-1)} className="bg-orange-500 hover:bg-orange-600 text-white">
          Finish
        </Button>
      </CardFooter>
    </Card>,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {stages[stage + 1]}
        </motion.div>
      </AnimatePresence>
      {stage >= 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center">
            <Wind className="w-6 h-6 mr-2 text-blue-500" />
            <span>Breathwork</span>
          </div>
          <div className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-500" />
            <span>Mindfulness</span>
          </div>
          <div className="flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
            <span>Reflection</span>
          </div>
          <div className="flex items-center">
            <Feather className="w-6 h-6 mr-2 text-green-500" />
            <span>Letting Go</span>
          </div>
        </div>
      )}
    </div>
  )
}