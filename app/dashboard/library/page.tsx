"use client";

import { useState } from 'react';
import { Plus, Search, Edit, ArrowRight } from 'lucide-react';

const books = [
  { id: 1, title: 'Primary English P.7', author: 'NCDC', class: 'P.7', copies: 45, available: 38, shelf: 'A-1' },
  { id: 2, title: 'Mathematics for Uganda P.4', author: 'MECS', class: 'P.4', copies: 30, available: 25, shelf: 'A-2' },
  { id: 3, title: 'Science & Technology P.6', author: 'NCDC', class: 'P.6', copies: 28, available: 20, shelf: 'B-1' },
  { id: 4, title: 'Social Studies S.1', author: 'MECS', class: 'S.1', copies: 35, available: 30, shelf: 'B-2' },
];

const recentLoans = [
  { id: 1, student: 'John Okello', class: 'P.7', book: 'English P.7', date: 'Apr 18, 2026', due: 'May 2, 2026', status: 'Active' },
  { id: 2, student: 'Sarah Nakato', class: 'S.1', book: 'Social Studies S.1', date: 'Apr 17, 2026', due: 'May 1, 2026', status: 'Active' },
];

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Library</h1>
          <p className="text-foreground/60">Manage books and lending</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <p className="text-sm text-foreground/60">Total Books</p>
          <p className="text-2xl font-bold">{books.reduce((sum, b) => sum + b.copies, 0)}</p>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <p className="text-sm text-foreground/60">Available</p>
          <p className="text-2xl font-bold">{books.reduce((sum, b) => sum + b.available, 0)}</p>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <p className="text-sm text-foreground/60">On Loan</p>
          <p className="text-2xl font-bold">{recentLoans.length}</p>
        </div>
      </div>

      {/* Books */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Author</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Available</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Shelf</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td className="px-4 py-3 font-medium">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">{book.class}</td>
                <td className="px-4 py-3 text-right">{book.available}/{book.copies}</td>
                <td className="px-4 py-3">{book.shelf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Loans */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Loans</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Book</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentLoans.map((loan) => (
              <tr key={loan.id}>
                <td className="px-4 py-3">{loan.student}</td>
                <td className="px-4 py-3">{loan.class}</td>
                <td className="px-4 py-3">{loan.book}</td>
                <td className="px-4 py-3">{loan.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
