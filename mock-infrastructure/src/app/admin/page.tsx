"use client";

import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Copy, Plus, Search, Filter } from 'lucide-react';
import QuestionForm from '@/components/admin/QuestionForm';

type Question = {
  id: string;
  question_number: number;
  section: string;
  difficulty: string;
  question_type: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  hint: string;
  estimated_time: number;
  skill: string;
  topic: string;
  image_url: string;
  is_active: boolean;
};

export default function AdminPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions/${sectionFilter}?difficulty=${difficultyFilter}&page=${page}&limit=10`);
      const json = await res.json();
      if (json.data) {
        setQuestions(json.data);
        setTotalPages(json.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [sectionFilter, difficultyFilter, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await fetch(`/api/admin/question?id=${id}`, { method: 'DELETE' });
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleDuplicate = async (q: Question) => {
    const { id, ...rest } = q;
    try {
      await fetch('/api/admin/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, question: `[COPY] ${rest.question}` })
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error duplicating:", error);
    }
  };

  const openForm = (q: Question | null = null) => {
    setEditingQuestion(q);
    setIsFormOpen(true);
  };

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(search.toLowerCase()) ||
    q.topic?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Question Manager</h1>
            <p className="text-gray-500 mt-1">Manage the core test questions database.</p>
          </div>
          <button 
            onClick={() => openForm()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Add New Question
          </button>
        </header>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-1 min-w-[300px] items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <Search size={20} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search questions or topics..." 
              className="bg-transparent border-none outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              value={sectionFilter} 
              onChange={(e) => { setSectionFilter(e.target.value); setPage(1); }}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="all">All Sections</option>
              <option value="quantitative">Quantitative</option>
              <option value="relationships">Relationships</option>
              <option value="patterns">Patterns</option>
              <option value="numerical_series">Numerical Series</option>
            </select>

            <select 
              value={difficultyFilter} 
              onChange={(e) => { setDifficultyFilter(e.target.value); setPage(1); }}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4">Question</th>
                  <th scope="col" className="px-6 py-4">Section / Topic</th>
                  <th scope="col" className="px-6 py-4">Difficulty</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading questions...</td>
                  </tr>
                ) : filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No questions found.</td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-md truncate">
                        {q.question_number && <span className="text-blue-600 mr-2">#{q.question_number}</span>}
                        {q.question}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="capitalize">{q.section.replace('_', ' ')}</span>
                          <span className="text-xs text-gray-400">{q.topic || 'No topic'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                          ${q.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                            q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(q)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDuplicate(q)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Duplicate">
                            <Copy size={18} />
                          </button>
                          <button onClick={() => handleDelete(q.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-500">
                Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Form Modal */}
      {isFormOpen && (
        <QuestionForm 
          question={editingQuestion} 
          onClose={() => setIsFormOpen(false)} 
          onSaved={() => {
            setIsFormOpen(false);
            fetchQuestions();
          }} 
        />
      )}
    </div>
  );
}
