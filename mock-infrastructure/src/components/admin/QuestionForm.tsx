"use client";

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Save, Eye } from 'lucide-react';

type Question = any; // simplified for now

interface QuestionFormProps {
  question: Question | null;
  onClose: () => void;
  onSaved: () => void;
}

const defaultQuestion = {
  question_number: 1,
  section: 'quantitative',
  difficulty: 'medium',
  question_type: 'multiple_choice',
  question: '',
  options: ['', '', '', ''],
  correct_answer: 'A',
  explanation: '',
  hint: '',
  estimated_time: 60,
  skill: '',
  topic: '',
  image_url: '',
  is_active: true
};

export default function QuestionForm({ question, onClose, onSaved }: QuestionFormProps) {
  const [formData, setFormData] = useState<Question>(defaultQuestion);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (question) {
      setFormData(question);
    }
  }, [question]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = !!formData.id;
      const res = await fetch('/api/admin/question', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save');
      onSaved();
    } catch (error) {
      console.error(error);
      alert('Error saving question');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {formData.id ? 'Edit Question' : 'Create New Question'}
          </h2>
          <div className="flex gap-2">
            <div className="bg-gray-200 p-1 rounded-lg flex text-sm">
              <button 
                onClick={() => setActiveTab('edit')} 
                className={`px-4 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'edit' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Edit
              </button>
              <button 
                onClick={() => setActiveTab('preview')} 
                className={`px-4 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors ${activeTab === 'preview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Eye size={16} /> Preview
              </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors ml-2">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === 'edit' ? (
            <form id="question-form" onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  <select name="section" value={formData.section} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="quantitative">Quantitative</option>
                    <option value="relationships">Relationships</option>
                    <option value="patterns">Patterns</option>
                    <option value="numerical_series">Numerical Series</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g. Algebra" className="w-full rounded-lg border-gray-300 border p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text (Markdown Supported)</label>
                <textarea 
                  name="question" 
                  value={formData.question} 
                  onChange={handleChange} 
                  rows={6}
                  required
                  className="w-full rounded-lg border-gray-300 border p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y font-mono text-sm"
                  placeholder="Enter the question here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon size={18} /> Image URL
                </label>
                <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." className="w-full rounded-lg border-gray-300 border p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <label className="text-sm font-medium text-gray-700 mr-2">Correct Answer</label>
                </div>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((letter, index) => (
                    <div key={letter} className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500">
                        {letter}
                      </div>
                      <textarea 
                        value={formData.options[index] || ''} 
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required
                        rows={2}
                        className="flex-1 rounded-lg border-gray-300 border p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder={`Option ${letter}`}
                      />
                      <div className="flex items-center h-10 px-4">
                        <input 
                          type="radio" 
                          name="correct_answer" 
                          value={letter} 
                          checked={formData.correct_answer === letter} 
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                <textarea 
                  name="explanation" 
                  value={formData.explanation} 
                  onChange={handleChange} 
                  rows={4}
                  className="w-full rounded-lg border-gray-300 border p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                  placeholder="Explain why the correct answer is correct..."
                />
              </div>

            </form>
          ) : (
            <div className="max-w-3xl mx-auto p-8 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <div className="mb-8 pb-8 border-b border-gray-100">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{formData.section.replace('_', ' ')}</span>
                <div className="mt-6 text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">{formData.question || 'Question text will appear here...'}</div>
                {formData.image_url && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-4">
                    <img src={formData.image_url} alt="Question Diagram" className="max-w-full h-auto mx-auto mix-blend-multiply" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((letter, index) => {
                  const isCorrect = formData.correct_answer === letter;
                  return (
                    <div key={letter} className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {letter}
                      </div>
                      <div className="pt-1 text-gray-700 whitespace-pre-wrap">{formData.options[index] || `Option ${letter}`}</div>
                    </div>
                  );
                })}
              </div>
              {formData.explanation && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-blue-900">
                  <h4 className="font-bold mb-2 flex items-center gap-2">Explanation</h4>
                  <div className="whitespace-pre-wrap opacity-90">{formData.explanation}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="question-form"
            disabled={saving || activeTab === 'preview'}
            className="px-5 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Question'}
          </button>
        </div>

      </div>
    </div>
  );
}
