'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Printer, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const getGradeColor = (grade: string) => {
  const g = grade?.toUpperCase() || '';
  if (g === 'A' || g === 'D1' || g === 'D2') return 'text-green-600 bg-green-100';
  if (g === 'B' || g === 'C3' || g === 'C4') return 'text-blue-600 bg-blue-100';
  if (g === 'C' || g === 'C5' || g === 'C6') return 'text-yellow-600 bg-yellow-100';
  if (g === 'D' || g === 'P7' || g === 'P8') return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

export default function ParentResultsPage() {
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('school_students') || '[]');
    if (students.length > 0) setStudent(students[0]);
    const stored = JSON.parse(localStorage.getItem('school_exam_results') || '[]');
    setResults(stored);
  }, []);

  const studentResults = results.filter((r: any) => r.studentId === student?.id || r.studentName === student?.name);
  const examNames = [...new Set(studentResults.map((r: any) => r.examName))];

  const calcAverage = (examName: string) => {
    const examResults = studentResults.filter((r: any) => r.examName === examName);
    if (examResults.length === 0) return 0;
    const total = examResults.reduce((sum: number, r: any) => sum + ((r.score || 0) / (r.maxScore || 1)) * 100, 0);
    return total / examResults.length;
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeColorClass = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Link href="/parent" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold">Exam Results</h1>

      {student && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {student.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-foreground/60">{student.class} - {student.admissionNo}</p>
            </div>
          </div>
        </div>
      )}

      {examNames.length > 0 ? examNames.map((examName: any) => {
        const examResults = studentResults.filter((r: any) => r.examName === examName);
        const average = calcAverage(examName);
        return (
          <div key={examName} className="bg-background rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">{examName}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getGradeColorClass(average)}`}>{average.toFixed(1)}%</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getGradeColorClass(average)} bg-opacity-10`}>
                  {getLetterGrade(average)}
                </span>
              </div>
            </div>
            <div className="divide-y">
              {examResults.map((r: any, i: number) => {
                const percentage = ((r.score || 0) / (r.maxScore || 1)) * 100;
                return (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-foreground/40" />
                      <div>
                        <p className="font-medium">{r.subjectName || r.examName}</p>
                        <p className="text-sm text-foreground/60">{r.score}/{r.maxScore}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full ${percentage >= 80 ? 'bg-green-600' : percentage >= 70 ? 'bg-blue-600' : percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                          style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-sm font-bold">{percentage.toFixed(0)}%</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(r.grade)}`}>{r.grade || getLetterGrade(percentage)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }) : (
        <div className="bg-background rounded-xl border p-8 text-center text-foreground/60">
          <FileText size={48} className="mx-auto mb-3 text-foreground/20" />
          <p>No results available yet</p>
        </div>
      )}
    </div>
  );
}
