'use client'
import { useBookStore, Gen } from '@/store/booksStore'
import React, { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';

function Page() {
  const { books, getBooks, createBook, isLoading } = useBookStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const success = await createBook(formData);
    if (success) setIsModalOpen(false);
  };

  if (isLoading && books.length === 0) return <div className='ml-50 p-10 font-sans'>Se încarcă biblioteca...</div>;

  return (
    <div className='p-10 flex flex-col relative'>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-bfirst border-2 border-accent w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 cursor-pointer hover:text-accent"
            >
              <X size={24} />
            </button>

            <h2 className="font-serif text-3xl mb-6 text-center">Add new book</h2>
            
            <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4 font-lora">
              <input name="title" type="text" placeholder="Book Title" className="col-span-2 p-3 border-2 border-accent rounded-xl bg-transparent outline-none" required />
              <input name="author" type="text" placeholder="Author" className="p-3 border-2 border-accent rounded-xl bg-transparent outline-none" required />
              <select name="gen" className="p-3 border-2 border-accent rounded-xl bg-transparent outline-none">
                {Object.values(Gen).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <textarea name="description" placeholder="Description" className="col-span-2 p-3 border-2 border-accent rounded-xl bg-transparent outline-none h-32" required></textarea>
              <div className='flex flex-row gap-3'>
                <div>
                  <p>Date when was wrote!</p>
                  <input name="writtenAt" type="date" className="flex-2 p-3 border-2 border-accent rounded-xl bg-transparent outline-none" required />

                </div>
                <div>
                  <p>Image of the book!</p>
                  <input name="image" type="file" accept="image/*" className="flex-3 p-3 border-2 border-accent rounded-xl bg-transparent outline-none" required />
                </div>
              
              </div>
              
              <input name="buyLink" type="text" placeholder="Buy Link" className="col-span-2 p-3 border-2 border-accent rounded-xl bg-transparent outline-none" />
              
              <button type="submit" className="col-span-2 mt-4 bg-accent text-bfirst font-bold py-3 rounded-xl hover:bg-bfirst hover:text-accent border-2 border-transparent hover:border-accent cursor-pointer transition-all">
                {isLoading ? "Saving..." : "Create Book"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={`transition-all duration-300 ${isModalOpen ? 'blur-md' : ''}`}>
        <div className='flex flex-row justify-between w-full'>
          <h1 className='text-5xl font-serif px-30'>My books</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className='font-lora text-2xl flex flex-row items-center justify-center gap-4 bg-accent border-2 border-bfirst px-4 rounded-2xl text-bfirst cursor-pointer hover:bg-bfirst hover:text-accent hover:border-accent transition-all duration-300 ease-in'
          >
            Add new book
            <Plus size={25} />
          </button>
        </div>
        
        <div className='mt-10 grid grid-cols-2 lg:grid-cols-3 gap-10 '>
          {Array.isArray(books) && books.length > 0 ? (
            books.map((book) => (
              <Link key={book.id}
              href={`/books/bookdId?bookId=${book.id}`}
              className='h-full block'
              >
                <div  className=' h-full flex-1 bg-bsecond w-full border-2 border-accent flex flex-col items-center p-4 cursor-pointer hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in'>
                  <div className='flex flex-row justify-between w-full'>
                    <p className='font-lora opacity-60 text-sm'>Posted on: {new Date(book.createdAt).toDateString()}</p>
                    <p className='self-end text-right bg-highli font-bold rounded-lg px-2 border-2 font-sans'>{book.gen}</p>
                  </div>
                  
                  <h1 className='font-serif text-4xl mb-2 font-bold'>{book.title}</h1>
                  <Image
                    src={book.image || "/contact.jpg"}
                    alt="logo"
                    width={290}
                    height={100}
                    className="object-contain border-4 border-highli mb-3" 
                    priority
                  />
                  
                  <p className='text-sm text-center p-4 italic font-lora mx-auto'>
                    &quot;{book.description.length>300
                    ? `${book.description.substring(0,300)}...`
                    : `${book.description}`
                    }&quot;
                  </p>
                  <p className='font-lora text-md text-right pr-4 w-full font-bold'>
                    {book.author}
                  </p>

                  <p className='self-start font-lora text-sm opacity-80'>Published in: {new Date(book.writtenAt).toDateString()}</p>
                </div>
              </Link>

            ))
          ) : (
            <p className='p-10 font-lora italic'>You haven&apos;t created any book yet!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page