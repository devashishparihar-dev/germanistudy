"use client";

import React from 'react';
import { CheckCircle, XCircle, Clock, Target, BarChart2 } from 'lucide-react';
import Link from 'next/link';

// Dummy results for display since we didn't hook up a full test session state
const dummyResults = {
  overallScore: 78,
  totalQuestions: 22,
  correctAnswers: 17,
  timeSpent: '32:15',
  accuracy: 77,
  sectionScores: [
    { name: 'Quantitative', score: 80, correct: 8, total: 10 },
    { name: 'Relationships', score: 75, correct: 9, total: 12 },
  ]
};

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Test Results</h1>
          <p className="text-gray-500 text-lg">Core Test Mock 1 - Completed on {new Date().toLocaleDateString()}</p>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <BarChart2 size={24} />
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Overall Score</div>
            <div className="text-4xl font-bold text-gray-900">{dummyResults.overallScore}%</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Correct</div>
            <div className="text-4xl font-bold text-gray-900">{dummyResults.correctAnswers} / {dummyResults.totalQuestions}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Accuracy</div>
            <div className="text-4xl font-bold text-gray-900">{dummyResults.accuracy}%</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Time Spent</div>
            <div className="text-4xl font-bold text-gray-900">{dummyResults.timeSpent}</div>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Score by Section</h3>
          <div className="space-y-6">
            {dummyResults.sectionScores.map((section, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-gray-700">{section.name}</span>
                  <span className="text-sm font-bold text-gray-900">{section.correct}/{section.total} ({section.score}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${section.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/simulator">
            <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors">
              Retake Test
            </button>
          </Link>
          <Link href="/">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
