"use client";

import { useState } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { useLibrary, useStudents, classes } from '@/lib/data';

export default function LibraryPage() {
  const { books, loans, addBook, issueBook, returnBook } = useLibrary();
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);
  const [showIssueBook, setShowIssueBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [bookForm, setBookForm] = useState({ title: '', author: '', class: 'P.7', copies: 1, available: 1, shelf: 'A-1' });
  const [issueForm, setIssueForm] = useState({ studentId: '' });

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeLoans = loans.filter(l => l.status === 'active');

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBook({ ...bookForm, available: bookForm.copies });
    setShowAddBook(false);
    setBookForm({ title: '', author: '', class: 'P.7', copies: 1, available: 1, shelf: 'A-1' });
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === issueForm.studentId);
    if (student && selectedBook) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      issueBook({
        studentId: student.id,
        studentName: student.name,
        class: student.class,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        loanDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0]
      });
      setShowIssueBook(false);
      setSelectedBook(null);
      setIssueForm({ studentId: '' });
    }
  };

  const handleReturn = (loanId: string) => {
    returnBook(loanId);
  };

  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Library</h1>
          <p className="text-foreground/60">Manage books and lending</p>
        </div>
        <button onClick={() => setShowAddBook(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
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
          <p className="text-2xl font-bold">{activeLoans.length}</p>
        </div>
      </div>

      {/* Books */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input type="text" placeholder="Search books..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
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
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
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
                <td className="px-4 py-3 text-right">
                  {book.available > 0 && (
                    <button onClick={() => { setSelectedBook(book); setShowIssueBook(true); }}
                      className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
                      Issue
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active Loans */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Active Loans ({activeLoans.length})</h3>
        </div>
        {activeLoans.length === 0 ? (
          <div className="p-8 text-center text-foreground/60">No active loans</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Book</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Due Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activeLoans.map((loan) => (
                <tr key={loan.id}>
                  <td className="px-4 py-3">{loan.studentName}</td>
                  <td className="px-4 py-3">{loan.class}</td>
                  <td className="px-4 py-3">{loan.bookTitle}</td>
                  <td className="px-4 py-3">{loan.dueDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleReturn(loan.id)}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Book</h2>
              <button onClick={() => setShowAddBook(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" required value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input type="text" required value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select value={bookForm.class} onChange={(e) => setBookForm({ ...bookForm, class: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Copies</label>
                  <input type="number" min="1" value={bookForm.copies} onChange={(e) => setBookForm({ ...bookForm, copies: parseInt(e.target.value), available: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shelf Location</label>
                <input type="text" required value={bookForm.shelf} onChange={(e) => setBookForm({ ...bookForm, shelf: e.target.value })}
                  placeholder="e.g. A-1"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddBook(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add Book</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {showIssueBook && selectedBook && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Issue Book</h2>
              <button onClick={() => setShowIssueBook(false)}><X size={20} /></button>
            </div>
            <p className="text-sm text-foreground/60 mb-4">Issuing: <strong>{selectedBook.title}</strong></p>
            <form onSubmit={handleIssueBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Student</label>
                <select required value={issueForm.studentId} onChange={(e) => setIssueForm({ studentId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Choose a student</option>
                  {students.filter(s => s.class === selectedBook.class).map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowIssueBook(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Issue Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}